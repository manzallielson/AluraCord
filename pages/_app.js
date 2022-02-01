import Css from '../globalStyle'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'


library.add(fab, faCoffee)

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            
            <Css/>
            <Component  {...pageProps} />
        </>


    )

}