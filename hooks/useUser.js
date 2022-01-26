import React, { useEffect, useState } from "react"


export function useUser() {

    if (typeof window !== 'undefined') {
        const [username, setUsername] = useState(localStorage.getItem('user'))

        function setUser(user) {
            setUsername(user)
            localStorage.setItem('user', user)
        }
        // useEffect(() => {
        //     console.log(username)
        // }, [username])
        return { username, setUser }
    }
    return {}
};

