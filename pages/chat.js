import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import {useUser} from '../hooks/useUser'

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const {username, setUsername} = useUser();
    console.log(username)
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
            id: listaDeMensagens.length + 1,
            de: username ? username : 'Visitante',
            texto: novaMensagem,
        };

        setListaDeMensagens([
            mensagem,
            ...listaDeMensagens,
        ]);
        setMensagem('');
    }

    function deleteMessage(id) {
        const newList = listaDeMensagens.filter((item)=> item.id != id )
        console.log(id)
        setListaDeMensagens(newList);
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
                                border: 'solid 1px white',
                                width: '100%',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: 'black',
                                marginRight: '12px',
                                color: 'white',
                                text: {
                                    color: 'white'
                                }
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
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                    styleSheet={{ color: 'white', border: 'solid 1px white', borderRadius: '5px 5px' }}
                />
            </Box>
        </>
    )
}

function MessageList({ mensagens, onDelete }) {
    const {username, setUsername} = useUser();

    console.log('MessageList', mensagens);

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
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >

                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${username}.png`}
                            />
                            <Text tag="strong">
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
                            <button onClick={() => onDelete(
                                mensagem.id
                            )}>
                                excluir
                            </button>
                        </Box>
                        {mensagem.texto}
                    </Text>
                );
            })}
        </Box>
    )
}