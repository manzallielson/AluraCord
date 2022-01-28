import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useUser } from '../hooks/useUser'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5NjAxNiwiZXhwIjoxOTU4ODcyMDE2fQ.7PMO85vuH3LA-kVKEx5x2rGTS4cjj6KPu21Jk5spZQU'
const SUPABASE_URL = 'https://hrxdmdigdqqnyhoeoarx.supabase.co'
const supaBaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const { username, setUsername } = useUser();

    React.useEffect(() => {
        getMensagens();
    }, []);

    function getMensagens() {
        supaBaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                console.log('dados da consulta :', data)
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
                setListaDeMensagens([
                    data[0],
                    ...listaDeMensagens,
                ]);
                setMensagem('');
            })
    }

    async function deleteMessage(id) {
        try {
            const { data, error } = await supaBaseClient
                .from('mensagens')
                .delete()
                .match({ id: id })
                
                const newList = listaDeMensagens.filter((item) => item.id != id)
                setListaDeMensagens(newList);
            
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
                    flex: 1,
                    border: 'solid 1px white',
                    borderRadius: '40px 0px 40px 40px',
                    backgroundColor: 'black',
                    height: '100%',
                    maxWidth: {
                        sm: '75%',
                        xs: '85%'
                    },
                    minWidth: '360px',
                    maxHeight: '85vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        border: 'solid 1px white',
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: '#5a3629',
                        flexDirection: 'column',
                        borderRadius: '25px 0px 25px 25px',
                        padding: '16px',
                    }}
                >

                    {/* <MessageList mensagens={[]} /> */}
                    <MessageList mensagens={listaDeMensagens} onDelete={deleteMessage} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
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
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: 'black',
                                marginRight: '12px',
                                color: 'white',
                                fontSize: '25px',

                            }}
                        />
                    </Box>
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
                        fontSize: '25px',
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
                            backgroundColor: '#5a3226'
                        },
                        color: 'white', border: 'solid 1px white', borderRadius: '5px 5px'
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
                                    styleSheet={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        marginRight: '8px',
                                    }}
                                    src={mensagem.de == '' ? `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png` : `https://github.com/${mensagem.de}.png`}
                                />
                                <Text tag="strong"
                                    styleSheet={{
                                        fontSize: '25px',
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
                                            backgroundColor: 'black',
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
                                fontSize: '25px',
                                color: 'white'

                            }}>

                            {mensagem.texto}
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