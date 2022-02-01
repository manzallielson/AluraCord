import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState } from 'react';
import appConfig from '../config.json';
import { useUser } from '../hooks/useUser';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
// import react from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';


const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5NjAxNiwiZXhwIjoxOTU4ODcyMDE2fQ.7PMO85vuH3LA-kVKEx5x2rGTS4cjj6KPu21Jk5spZQU'
const SUPABASE_URL = 'https://hrxdmdigdqqnyhoeoarx.supabase.co'
const supaBaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const element = <FontAwesomeIcon icon={faCoffee} />

function RealtimeClient(adicionaMensagem) {
    return supaBaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const [mensagem, setMensagem] = useState('');
    const [listaDeMensagens, setListaDeMensagens] = useState([]);
    const { username, setUsername } = useUser();
    const [chat, setChat] = useState(false);
    const [deletado, setDeletado] = useState(false);

    React.useEffect(() => {
        getMensagens();
        const subscription = RealtimeClient((novaMensagem) => {
            console.log('Nova mensagem:', novaMensagem);
            console.log('listaDeMensagens:', listaDeMensagens);

            setListaDeMensagens((valorAtualDaLista) => {
                console.log('valorAtualDaLista:', valorAtualDaLista);
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
        });
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    function getMensagens() {
        supaBaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                // console.log('dados da consulta :', data)
                setListaDeMensagens(data);
            });
    }
    /* 
    // usuario
    -usuario digita no campo textarea
    -aperta enter para enviar
    -tem que adicionar o texto na listagem
    
    //dev
    -[x] campo criado
    -[] vamos usar o onChange usa useState (ter if para caso seja enter para limpar a variavel)
    -[] listagem de mensagens
    
    */
    function deleta() {
        setDeletado(true)
    }
    function chamaGrupo() {
        setChat(!chat)
    }

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: username ? username : 'Visitante',
            texto: novaMensagem,
        };
        supaBaseClient
            .from('mensagens')
            .insert([
                //mesmo nome do objeto criado no banco de dados
                mensagem
            ])
            .then(({ data }) => {
                console.log(data)
                setMensagem('');
            })
    }

    async function deleteMessage(mensagem) {
        try {
            if (username === mensagem.de) {
                setDeletado(true)
                const { data, error } = await supaBaseClient
                    .from('mensagens')
                    .delete()
                    .match({ id: mensagem.id })

                const newList = listaDeMensagens.filter((item) => item.id != mensagem.id)
                setListaDeMensagens(newList);
            } else {
                alert('faça loggin com usuario "administrador" para excluir a conversa')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: {
                    xs: 'column',
                    sm: 'row'
                },
                backgroundColor: appConfig.theme.colors.primary['400'],
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',

                height: '100vh',
                width: '100vw',
                border: 'solid 15px black'
            }}
        >
            <Box styleSheet={{
                border: '1px solid black',
                width: {
                    xs: '100%',
                    sm: '30%'
                },
                height: {
                    xs: '15%',
                    sm: '100%'

                },
                color: 'black',
                display: 'flex',
                flexDirection: {
                    xs: 'column',
                    sm: 'row'
                },
                flexDirection: 'column',
                alignItems: 'center',
                // justifyContent: 'space-around'
            }}>
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        width: '100%',
                        // padding: '3px',
                        fontSize: {
                            sm: '20px',
                            xs: '15px',
                        },
                        fontWeight: '900',
                        backgroundColor: appConfig.theme.colors.primary['400'],
                        textAlign: 'center',
                        // height: '1'
                    }}
                ><Image src={`https://github.com/${username}.png`}
                    styleSheet={{
                        width: '50px',
                        height: '50px',
                        border: '1px solid black',
                        borderRadius: '50%'
                    }}
                    />
                    <Image src='/check-circle-regular.svg'
                        styleSheet={{
                            width: '35px',
                            height: '35px',
                        }} />
                    <Image src='/comment-alt-solid.svg'
                        styleSheet={{
                            width: '35px',
                            height: '35px',
                        }} />

                    <Link href='/'>
                        <Image src='/ellipsis-v-solid.svg'
                            styleSheet={{
                                width: '35px',
                                height: '35px',
                            }} />
                    </Link>

                </Box>
                <Box
                    styleSheet={{
                        height: {
                            xs: '100%',
                            sm: '10%'
                        },
                        width: '100%',
                    }}>

                    <Button
                        onClick={(event) => { chamaGrupo() }}
                        label="Alura Chat"
                        styleSheet={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            color: 'black',
                            border: '5px solid black',
                            fontWeight:'600',
                            hover: {
                                backgroundColor: 'green',
                                color:'white',
                                border: '5px solid white',
                            },
                            select: {
                                backgroundColor: '#045C4E'
                            },
                            checked: {
                                backgroundColor: '#045C4E'
                            },
                            focus: {
                                backgroundColor: '#045C4E'
                            }
                        }}>

                    </Button>
                </Box>
            </Box>
            {/* Tela sem chat */}
            {!chat ?
                <Box
                    styleSheet={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        border: 'solid 1px white',
                        backgroundColor: appConfig.theme.colors.primary['500'],
                        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                        height: '100%',
                        maxWidth: {
                            sm: '100%',
                            xs: '100%'
                        },
                        // minWidth: '360px',
                        maxHeight: '100vh',
                    }}
                >
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#efeae2',
                            backgroundColor: appConfig.theme.colors.primary['500'],
                            backgroundImage: `url(/bgFound.png)`,
                            width: '100%',
                            height: '100%',

                            textAlign: 'center',
                            justifyContent: 'space-around',

                        }}>
                        <h1>Clique em uma conversa</h1>
                        <span>ou</span>
                        <h1>Incie uma nova conversa</h1>
                    </Box>

                </Box>

                :

                <Box
                    styleSheet={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        // border: 'solid 1px white',
                        backgroundColor: appConfig.theme.colors.primary['700'],
                        height: '100%',
                        maxWidth: {
                            sm: '100%',
                            xs: '100%'
                        },
                        minWidth: '310px',
                        maxHeight: '100vh',
                    }}
                >


                    <Header />

                    <Box
                        styleSheet={{
                            height: '100%',
                            overflowY: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            flex: 1,
                            backgroundColor: '#efeae2',
                            backgroundImage: `url(/bgFound.png)`,
                            flexDirection: 'column',
                            borderRadius: '15px 0px 0px 0px',
                            padding: {
                                md: '10px',
                                xs: '5px'
                            },
                            justifyContent: 'center',

                        }}
                    >


                        {/* <MessageList mensagens={[]} /> */}
                        <Box
                            styleSheet={{

                                height: '100%',
                                overflowY: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                flex: 1,
                                backgroundColor: appConfig.theme.colors.primary['400'],
                                backgroundImage: `url(/bgFound.png)`,
                                flexDirection: 'column',
                                borderRadius: '15px 0px 0px 0px',
                                padding: {
                                    md: '10px',
                                    xs: '5px'
                                },
                                justifyContent: 'center',

                            }}>
                            <MessageList mensagens={listaDeMensagens} onDelete={deleteMessage} styleSheet={{
                                flexDirection: 'start'
                            }} />
                        </Box>

                        <Box
                            as="form"
                            styleSheet={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                        </Box>
                    </Box>

                    <Box
                        styleSheet={{
                            margin: {
                                sm: '20px 0 0 10px ',
                                xs: "10px 0 0 10px"
                            },
                            display: 'flex',
                        }}
                    >
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                console.log(sticker)
                                handleNovaMensagem(`:sticker:${sticker}`);
                            }}
                            styleSheet={{
                                margin: '10px'
                            }}
                        />
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                alignItems: 'center',
                                border: 'solid 1px white',
                                width: '100%',
                                height: '100%',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: 'white',
                                margin: '0px 12px 12px 12px',
                                color: 'black',
                                fontSize: '15px',

                            }}
                        />

                        <Button
                            onClick={(event) => {
                                handleNovaMensagem(mensagem);
                            }}
                            label={'ENVIAR'}
                            styleSheet={{
                                marginLeft: '10px',
                                border: '5px solid white',
                                width: '100px',
                                height: '48px',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: 'green',
                                color: 'white',
                                fontSize: {
                                    sm: '10px',
                                    xs: "10px",
                                },
                                hover: {
                                    backgroundColor: 'green',
                                    color:'white',
                                    border: '5px solid white',
                                },
                                select: {
                                    backgroundColor: '#045C4E'
                                },
                                checked: {
                                    backgroundColor: '#green'
                                },
                                focus: {
                                    backgroundColor: '#green'
                                }
                            }}>
                        </Button>
                    </Box>


                </Box>

            }


            {/* Chat */}

        </Box>
    )
}

function Header() {
    const { username, setUsername } = useUser();

    return (
        <>
            <Box styleSheet={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: appConfig.theme.colors.primary['400'],
            border:'solid black 1px'
            }} >
                <Box
                styleSheet={{
                    marginLeft:'20px',
                    width:'40%'
                }}>

                    <Image
                        src={'/familia.jpeg'}
                        styleSheet={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50px',
                        }}

                    />
                </Box>

                <Box
                
                styleSheet={{
                    width:'90%',
                    display:'flex',
                    textAlign:'center',
                }}>

                    <Text variant='heading5'
                        styleSheet={{
                            textAlign:'center',
                            fontSize: {
                                sm: '30px',
                                xs: '10px',
                            }
                        }}>
                        Alura Chat
                    </Text>
                </Box>
            </Box>
        </>
    )
}

function MessageList({ mensagens, onDelete }) {
    const { username, setUsername } = useUser();


    return (

        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',


            }}
        >
            {mensagens.map((mensagem, index) => {
                return (

                    <Text
                        key={index}
                        tag="li"
                        styleSheet={{
                            alignSelf: username === mensagem.de ? 'end' : 'start',
                            borderRadius: username === mensagem.de ? '10px 0px 10px 10px' : '0px 10px 10px 10px',
                            padding: '6px',
                            margin: '0 12px 10px 10px',
                            backgroundColor: 'white',
                            width: '80%',

                        }}
                    >

                        <Box
                            styleSheet={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: 'center',

                            }}
                        >
                            <Box styleSheet={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: 'center',
                            }}>


                                <Image
                                    Text={'ola'}
                                    styleSheet={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        marginRight: '8px',
                                        hover: {
                                            indexZ: '4',
                                            position: 'relative',
                                            top: '0',
                                            left: '0',
                                            height: '60px',
                                            width: '60px',
                                            transition: '.3s linear',
                                            border: "1px solid white",
                                        }
                                    }}
                                    src={mensagem.de == '' ? `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png` : `https://github.com/${mensagem.de}.png`}
                                />
                                <Text tag="strong"
                                    styleSheet={{
                                        fontSize: '15px',
                                        color: 'black',
                                        fontWeight: '900',
                                        textAlign: 'center',
                                        alignSelf: 'center'

                                    }}>
                                    {mensagem.de}
                                </Text>

                                <Text
                                    styleSheet={{
                                        fontSize: '10px',
                                        marginLeft: '8px',
                                        color: appConfig.theme.colors.neutrals[300],
                                    }}
                                    tag="span"
                                >
                                    {(new Date().toLocaleDateString())}
                                </Text>
                            </Box>

                            {/* {mensagem.texto.startsWith(':sticker:').toString()} */}


                            <Box styleSheet={{
                                marginRight: '10px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                {username === mensagem.de &&

                                    <Button
                                        label='X'
                                        styleSheet={{
                                            width: '10px',
                                            height: '10px',
                                            backgroundColor: '#5a3226',
                                            hover: {
                                                backgroundColor: 'red',
                                                color: 'white',
                                                border: 'solid 1px white'

                                            },

                                        }} onClick={() => onDelete(
                                            mensagem
                                        )}>
                                    </Button>
                                }

                            </Box>

                        </Box>
                        <Box
                            styleSheet={{
                                marginTop: '5px',
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: 'space-between',
                                fontSize: '15px',
                                color: 'black',


                            }}>

                            {mensagem.texto.startsWith(':sticker:')
                                ? (
                                    <Image src={mensagem.texto.replace(":sticker:", "")} styleSheet={{
                                        maxWidth: '150px',
                                        maxHeight: '150px'
                                    }} />
                                ) :
                                (
                                    mensagem.texto
                                )}


                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    color: appConfig.theme.colors.neutrals[300],
                                    display: 'flex',
                                    flexDirection: 'collumn'
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleTimeString('pt-br'))} {/* deixar horario estatico*/}


                            </Text>
                        </Box>

                    </Text>
                );
            })}
        </Box >
    )
}