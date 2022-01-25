import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';

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




export default function chat() {
    const [username, setUsername] = React.useState('manzallielson');
    const roteamento = useRouter();

    return (

        <Box>

            <Box
                styleSheet={{
                    height: "100vh",
                    width: '100vw',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: appConfig.theme.colors.primary["000"],
                    backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/07/bookshelf-at-dunster-house-library-1024x576.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                }}
            >

                <Box styleSheet={{
                    fontSize: {
                        xs: '1em',
                        sm: '2em',
                    },
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
                        CHAT DE PERGUNTAS
                    </h1>

                </Box>


                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        borderRadius: '35px 0px 35px 35px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.novas["000"],
                        border: 'solid white 1px'

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

                        <Titulo tag="h2">Chat de Perguntas</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            onChange={function (event) {
                                const valor = event.target.value;
                                setUsername(valor);
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
                                backgroundColor: '#5a3226',
                            }}
                        />
                    </Box>

                </Box>
            </Box>
        </Box >
    )

};