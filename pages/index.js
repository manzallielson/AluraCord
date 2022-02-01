import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import {useUser} from '../hooks/useUser'





function Titulo(props) {
    const Tag = props.tag || 'h1';
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
            ${Tag} {
                color: ${appConfig.theme.colors.neutrals['000']};
                font-size: 24px;
                font-weight: 600;
            }
            `}</style>
        </>
    );
}

// Componente React
// function HomePage() {
//     // JSX
//     return (
//         <div>
//             <GlobalStyle />
//             <Titulo tag="h2">Boas vindas de volta!</Titulo>
//             <h2>Discord - Alura Matrix</h2>
//         </div>
//     )
// }
// export default HomePage

export default function PaginaInicial() {
    const {username,setUser} = useUser();  
    const roteamento = useRouter();

  
    const paginaChat = () => {
        return (
            roteamento.push("/chat")
        )
    }

    return (
        <Box>

            <Box
                styleSheet={{
                    height: "100vh",
                    width: '100vw',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor:'black',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                   
                }}
            >

                <Box styleSheet={{
                    fontSize: '2em',
                    textAlign: 'center',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: {
                        xs: 'column',
                        sm: 'row',
                    },
                    width: '100%', maxWidth: '700px',
                    textShadow: '-2px 0 black, 0 2px black , 2px 0 black , 0 -2px black',
                    
                }}>

                    <h1>
                        Whats da Alura
                    </h1>

                </Box>


                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        borderRadius: '35px 0px 35px 35px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.primary["500"],
                        border: 'solid white 1px',
                       
                        

                    }}
                >


                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={function (evento) {
                            evento.preventDefault();
                            roteamento.push('/chat')
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                            
                        }}
                    >

                        <Titulo tag="h2">Bora aprender juntos ?</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            value={username}
                            onChange={function (event) {
                                const valor = event.target.value;
                                setUser(valor);
                                // localStorage.setItem("userName",valor)
                            }}
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                            styleSheet={{
                                border: 'solid 1px white',
                                backgroundColor: 'white',
                                color: 'black',
                                fontSize: '16px',
                                fontWeight: '900'

                            }}
                        />
                        <Button

                            type='submit'
                            label='Entrar'
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.novas['000'],
                                mainColorLight: appConfig.theme.colors.primary['000'],

                            }}
                            styleSheet={{
                                border: 'solid 1px white',
                                backgroundColor: 'black',
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px 16px 16px 16px',
                            background: appConfig.theme.colors.novas["000"],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals["000"],
                            borderRadius: '35px 0px 35px 35px',
                            flex: 1,
                            minHeight: '240px',

                        }}
                    >
                        <Image
                            styleSheet={{
                                border: "solid 1px",
                                borderColor: appConfig.theme.colors.neutrals["000"],
                                borderRadius: '35px 0px 35px 35px',
                                marginBottom: '16px',
                            }}
                            src={username == '' ? `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png` : `https://github.com/${username}.png`}
                        />

                        <Button
                            href= {`https://www.github.com/${username}`} //https
                            label={`GitHub ${username}`}
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                            }}
                            styleSheet={{
                                textAlign:'center',
                                border: 'solid 1px white',
                                borderRadius: '10px 10px',
                                backgroundColor: '#0AC435',
                                padding: '5px 20px',
                            }}

                        />


                        {/* </Text> */}
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </Box >
    );
}