import './App.css'

function App() {

  return (
    <>
     <form action="/log-in" method='POST'>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email_input" />
          
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password_input" />

        <button type="submit">Sign in</button>
        <p>Or</p>
     </form>

     <form action="auth/google/sign-in">
        <button type="submit">Sign in with Google</button>
     </form>
     <p>Don't have an account? <a href="/sign-up">Sign up</a></p>
    </>
  )
}

export default App
