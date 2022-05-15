import moment from 'moment'

function isEven(value:number) {
    return !(value % 2)
}

type date = {
    starting: string,
    ending: string,
    title: string,
    text: string
}

type dates = Array<date>

type styleMainDivEvent = {
    top: string,
    maxHeight: string,
    transition: string,
    width?: string,
    left?: string,
    right?: string,
}

const getHeightOfTimeline = (heightPerYears:number) => {
    const starting = moment("01/01/2012", "DD/MM/YYYY")
    const ending = moment(new Date())
    const numberOfYears = ending.diff(starting, 'years')
    return (numberOfYears * heightPerYears) + heightPerYears
}

const makeLineByMounths = (heightOfTimeline:number, heightPerYears:number) => {
    const numberOfPrint = heightOfTimeline / heightPerYears
    const listOfElements = []
    const actualDate = moment(new Date())
    for (let i = 0; i < numberOfPrint; i++) {
        listOfElements.push(
            <div key={`timeline${i}`} style={{height: `${heightPerYears}px`}} className='bg-blue text-gold items-center text-center hover:bg-opacity-80 hover:cursor-pointer border-y-1 border-gold border'>
                <div className='flex flex-col justify-center text-center items-center h-full'>
                    <p className=''>{moment(moment(actualDate).subtract(i, 'years')).format('YYYY')}</p>
                </div>
            </div>
        )
    }
    return listOfElements
}

const checkIfElementWillBeSuperimposed = (indexToCheck:number, indexToCheckIsEven:boolean, dates:dates) => {
    const dateToCheck = dates[indexToCheck]
    let numberOfSuperposition = 0,
        order = 1,
        superPosedByIndex:Array<number> = []

    dates.map((date:date, index:number) => {
        const indexIsEven = isEven(index)
        if (index !== indexToCheck && ((indexIsEven && indexToCheckIsEven) || (!indexIsEven && !indexToCheckIsEven))) {
            if (moment(dateToCheck.starting).isBetween(date.starting, date.ending)
            || moment(dateToCheck.ending).isBetween(date.starting, date.ending)
            ||(moment(date.starting).isBetween(dateToCheck.starting, dateToCheck.ending)) ) {
                if (indexToCheckIsEven) {
                   // console.log("date starting ==> ", (moment(date.starting).isBetween(dateToCheck.starting, dateToCheck.ending))) 
                }
                
                numberOfSuperposition += 1
                superPosedByIndex.push(index)
                if (indexToCheck > index) {
                    order += 1
                }
            }
        }
    })
    return {
        numberOfSuperposition,
        order,
        superPosedByIndex
    }
}

const jsxForAllEvents = (dates:dates, heightPerYears:number) => {
    const eventsJsxForLeftPart:Array<JSX.Element> = []
    const eventsJsxForRightPart:Array<JSX.Element> = []

    const lastSuperpositionIndex:Array<number> = []

    dates.map((date:date, index:number) => {
        const indexIsEven = isEven(index)
        // Mounth begin to 0 so month 11 is December
        const diffOfWeeks = moment().set('date', 31).set('month', 11).diff(moment(date.ending), 'weeks')
        const eventPositionTop = diffOfWeeks * (heightPerYears / 52)
        const eventHeight = moment(date.ending).diff(moment(date.starting), 'weeks') * (heightPerYears / 52)

        const styleMainDivEvent:styleMainDivEvent = {
            top: `${eventPositionTop}px`,
            maxHeight: `${eventHeight >= 38 ? eventHeight : 38}px`,
            transition: 'max-height 2s ease-out, background-color 1s ease-out'
        }

        const willBeSuperimposedInfo = checkIfElementWillBeSuperimposed(index, indexIsEven, dates)
        if (indexIsEven) {
            // console.log('Date ==> ', date.title)
            // console.log('willBeSuperimposedInfo ==> ', willBeSuperimposedInfo)
            // console.log('indexIsEven ==> ', indexIsEven)
            // console.log('lastSuperpositionIndex ==> ', lastSuperpositionIndex)
        }
        
        if (willBeSuperimposedInfo.numberOfSuperposition > 0) {
            styleMainDivEvent.width = '48%'
            
            if (willBeSuperimposedInfo.order > 1  && !(lastSuperpositionIndex.includes(index - 2) && lastSuperpositionIndex.includes(index - 4))) {
                styleMainDivEvent.left = '52%'
            }
            lastSuperpositionIndex.push(index)
        } else if (!indexIsEven) {
            styleMainDivEvent.right = '0%'
        }

        const eventJsx = 
            <div key={`event${index}`} style={styleMainDivEvent} className={`text-center dateElementDiv overflow-y-hidden absolute p-1 border-y-1 border-blue hover:z-10`}>
                <h3 className='text-lg text-blue'><b>{date.title}</b></h3>
                <p className='text-sm mb-2'><i>From <b>{moment(date.starting).format('DD/MM/YYYY')}</b> to <b>{moment(date.ending).format('DD/MM/YYYY')}</b></i></p>
                <p>{date.text}</p>
            </div>

        if (indexIsEven) {
            eventsJsxForRightPart.push(eventJsx)
        } else {
            eventsJsxForLeftPart.push(eventJsx)
        }
        
    })
    return {eventsJsxForLeftPart, eventsJsxForRightPart}
}

export default function Timeline(props) {

    const { timelineEvents, user } = props

    console.log('user in timeline  ==> ', user)

    const heightPerYears = 52

    const timelineEventsSorted = timelineEvents.sort((a, b) => {
        const dateA = moment(a.starting).format('YYYYMMDD')
        const dateB = moment(b.starting).format('YYYYMMDD')
	    return dateA < dateB ? 1 : -1
    })

    // console.log('dates sorted ==> ', dates)
    const heightOfTimeline = getHeightOfTimeline(heightPerYears)

    const {eventsJsxForLeftPart, eventsJsxForRightPart} = jsxForAllEvents(timelineEventsSorted, heightPerYears)

    return (
        <div className='w-full'>
            <div style={{height: heightOfTimeline}} className='flex w-full'>
                <div className='w-1/2 h-full relative'>
                    {eventsJsxForLeftPart}
                </div>
                <div className='flex flex-col h-full w-24 overflow-hidden border-2 border-gold mx-2 rounded-3xl'>
                    {makeLineByMounths(heightOfTimeline, heightPerYears)}
                </div>
                <div className='w-1/2 h-full relative'>
                    {eventsJsxForRightPart}
                </div>
                <br />
            </div>
            {user !== null ?
                <button className='defaultButton'>
                    Add an event
                </button>

            :
            null
            }
        </div>
    )
}