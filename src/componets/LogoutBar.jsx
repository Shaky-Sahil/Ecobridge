import React from 'react'

const LogoutBar = () => {
  return (
    <div>
     <Button variant='contained' onClick={()=> auth.signOut()}>Sign Out</Button>
    </div>
  )
}

export default LogoutBar
