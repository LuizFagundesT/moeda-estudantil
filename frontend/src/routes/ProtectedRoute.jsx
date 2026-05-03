import { Navigate } from "react-router-dom"

export default function ProtectedRoute ({children, tipoPermitido}){
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'))

    if(!usuario){
        return(<Navigate to='/'/>)
    }

    if(tipoPermitido && usuario.tipoUsuario!== tipoPermitido){
        return <Navigate to='/'/>
    }

    return children
}