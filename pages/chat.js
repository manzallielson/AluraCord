import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useUser } from '../hooks/useUser';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5NjAxNiwiZXhwIjoxOTU4ODcyMDE2fQ.7PMO85vuH3LA-kVKEx5x2rGTS4cjj6KPu21Jk5spZQU'
const SUPABASE_URL = 'https://hrxdmdigdqqnyhoeoarx.supabase.co'
const supaBaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function RealtimeClient(adicionaMensagem) {
    return supaBaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const { username, setUsername } = useUser();



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

async function deleteMessage(id) {


    try {
        if (username == 'administrador') {
            const { data, error } = await supaBaseClient
                .from('mensagens')
                .delete()
                .match({ id: id })

            const newList = listaDeMensagens.filter((item) => item.id != id)
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
            backgroundColor: appConfig.theme.colors.primary['000'],
            backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/07/bookshelf-at-dunster-house-library-1024x576.jpg)',
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
            color: appConfig.theme.colors.neutrals['000']
        }}
    >
        <Box
            styleSheet={{
                display: 'flex',
                flexDirection: 'column',
                // justifyContent:'space-between',
                // alignItems:'space-between',
                // alignContent:'space-between',
                flex: 1,
                border: 'solid 1px white',
                borderRadius: '40px 0px 40px 40px',
                backgroundColor: 'black',
                height: '100%',
                maxWidth: {
                    sm: '60%',
                    xs: '70%'
                },
                minWidth: '360px',
                maxHeight: '80vh',
                padding: {
                    sm: '50px',
                    xs: '30px'
                },
            }}
        >
            <Header />

            <Box
                styleSheet={{
                    overflowY: 'hidden',
                    border: 'solid 1px white',
                    position: 'relative',
                    display: 'flex',
                    flex: 1,
                    backgroundColor: '#5a3629',
                    flexDirection: 'column',
                    borderRadius: '15px 0px 0px 0px',
                    padding: {
                        sm: '5px',
                        xs: '10px'
                    },
                    justifyContent: 'center'
                }}
            >


                {/* <MessageList mensagens={[]} /> */}
                <MessageList mensagens={listaDeMensagens} onDelete={deleteMessage} />
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
                        sm: '20px 0 0 0 ',
                        xs: "10px 0 0 0"
                    },
                    display: 'flex',

                }}
            >
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
                        marginRight: '12px',
                        color: 'black',
                        fontSize: '15px',

                    }}
                />

                <ButtonSendSticker
                    onStickerClick={(sticker) => {
                        console.log(sticker)
                        handleNovaMensagem(`:sticker:${sticker}`);
                    }}
                />
                <Button
                    onClick={(event) => {
                        handleNovaMensagem(mensagem);
                    }}
                    label={'ENVIAR'}
                    styleSheet={{
                        marginLeft: '10px',
                        border: 'solid 1px white',
                        width: '20%',
                        height: '48px',
                        borderRadius: '5px',
                        padding: '6px 8px',
                        backgroundColor: 'black',
                        color: 'green',
                        fontSize: '15px',
                        hover: {
                            backgroundColor: 'green',
                            color: 'white'
                        }
                    }}
                >
                </Button>
            </Box>


        </Box>
    </Box>
)
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'
                    styleSheet={{
                        fontSize: '40px',
                    }
                    }>
                    AluraCord
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                    styleSheet={{
                        hover: {
                            backgroundColor: 'red'
                        },
                        color: 'red', border: 'solid 1px white', borderRadius: '5px 5px'
                    }}
                />
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
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',

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
                                alignItems: 'center'
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
                                        color: 'yellow'
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
                                        mensagem.id
                                    )}>
                                </Button>
                            </Box>

                        </Box>
                        <Box
                            styleSheet={{
                                marginTop: '5px',
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: 'space-between',
                                fontSize: '15px',
                                color: 'white'

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