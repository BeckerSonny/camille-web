import { Link } from "@remix-run/react";

import { fistLetterUppperCase } from "./utils/printFunctions"

import camilleBW from './styles/images/camille_bw.png'

export default function Navbar(props) {
    const linksToUse = [
        {
            to: "/",
            display: "Home"
        },
        {
            to: "research",
        },
        {
            to: "blog",
        },
        {
            to: "contact",
        },
    ]
    return (
        <nav className="bg-blue flex md:block border-y-4 border-gold p-2 md:h-24 h-48 md:justify-items-center my-8 shadow-xl">
            <div className="flex flex-wrap justify-between items-center h-32 md:h-full overflow-visible xl:pl-12 lg:pl-8 md:pl-2 2xl:pr-96 xl:pr-72 lg:pr-32 md:pr-8"> 
                <Link to="/" className="flex items-center h-full overflow-visible">
                    <img src={camilleBW} className="object-scale-down h-32 rounded-full shadow-xl" alt="Camille Fakche" />
                    <div className="ml-2 block">
                        <h1 className="text-gold text-2xl whitespace-nowrap">Camille Fakche</h1>
                        <h2 className="text-slate-50 text-xl whitespace-nowrap">Cognitive Neuroscience</h2>
                    </div>
                </Link>
                <div className="w-full md:block md:w-auto" id="mobile-menu">
                    <ul className="flex text-gold mt-4 flex-row space-x-8 mt-0 text-xl font-medium">
                        {linksToUse.map((linkInfo, index) => {
                            return (
                                <li key={`nabarElement${index}`}>
                                    <Link to={linkInfo.to} className="block hover:opacity-80" aria-current="page">
                                        {linkInfo.display !== undefined ? linkInfo.display : fistLetterUppperCase(linkInfo.to)}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                {props.user ?
                    <div className="flex flex-col text-center text-red-500">
                        <p><i>Admin mode is active</i></p>
                        <form action="/logout" method="post">
                            <button type="submit" className="defaultButton border-red-500 text-red-500">
                                Logout for disable
                            </button>
                        </form>
                    </div>
                :
                    null
                }
            </div>
        </nav>
  );
}