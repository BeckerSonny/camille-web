import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
    const admin = await db.user.create({
      data: {
        username: "camilleAdmin",
        // this is a hashed version of "jetest"
        passwordHash:
          "$2a$12$bBwJSKhJrH1nPZXm.yiDUOxlIau8y2oG45yMtZvRrZcF4m4lZiVLq",
      },
    });
    console.log("admin ==> ", admin)
    await Promise.all(
      getTimelineEvents().map((timelineEvent) => {
          console.log('timelineEvent ==> ', timelineEvent)
        return db.timelineEvent.create({ data: timelineEvent });
      })
    );
  }
  
  seed();

  function getTimelineEvents() {
  
    return [
        {
            starting: new Date("2022-09-01"),
            ending: new Date("2015-06-01"),
            title: 'Bachelor\'s in Animal Physiology',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In justo ligula, luctus ut ante eu, eleifend pulvinar leo. Aenean eget.'
        }, {
            starting:  new Date("2015-09-01"),
            ending:  new Date("2017-06-01"),
            title: 'Research Masters in Fundamental and Clinical Neurosciences',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac dolor justo. Vestibulum imperdiet.'
        }, {
            starting: new Date("2015-01-01"),
            ending: new Date("2016-06-01"),
            title: 'Test 1',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu nibh risus. Cras consequat et mi vel mollis. Donec vulputate vel enim sed consequat.'
        }, {
            starting: new Date("2018-09-01"),
            ending: new Date("2022-09-01"),
            title: 'These',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec felis sit amet massa tempor lacinia. Sed vel arcu.'
        },
        {
            starting: new Date("2019-01-01"),
            ending: new Date("2022-12-31"),
            title: 'Test a',
            text: 'Lorem ipsum dolor sit amet.'
        },
        {
            starting: new Date("2015-04-01"),
            ending: new Date("2017-06-01"),
            title: 'Test 4',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu nibh risus. Cras consequat et mi vel mollis. Donec vulputate vel enim sed consequat.'
        },
        {
            starting: new Date("2016-04-01"),
            ending: new Date("2016-04-07"),
            title: 'Test 5',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu nibh risus. Cras consequat et mi vel mollis. Donec vulputate vel eanim sed consequat.'
        },
    ]
  }