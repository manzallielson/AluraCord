import Css from '../globalStyle'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            
            <Css/>
            <Component  {...pageProps} />
        </>


    )

}