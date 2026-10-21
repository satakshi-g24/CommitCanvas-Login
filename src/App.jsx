
// // import { useState } from 'react'
// // import './App.css'

// // function App() {
// //   const [email, setEmail] = useState('')

  
// // async function handleSubmit(event) {
// //   event.preventDefault()

// //   if (email.trim() === '') {
// //     alert('Please enter your email address')
// //     return
// //   }

// //   try {
// //     const response = await fetch('http://localhost:5000/send-otp', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({ email })
// //     })

// //     const result = await response.json()

// //     if (!response.ok) {
// //       alert(result.message || 'Failed to send OTP')
// //       return
// //     }

// //     alert('OTP request successful! Check your email.')
// //   } catch (error) {
// //      console.error('Connection error:', error)
// //   alert('Connection failed: ' + error.message)

// //     // alert('Cannot connect to server. Please check if the backend is running.')
// //   }
// // }

// //   return (
// //     <div className="page">
// //       <div className="login-card">

// //         <div className="logo">GC</div>

// //         <h1>Welcome back!</h1>

// //         <p className="subtitle">
// //           Sign in to continue to Git Clone
// //         </p>

// //         <form onSubmit={handleSubmit}>
// //           <label htmlFor="email">Email address</label>

// //           <input
// //             id="email"
// //             type="email"
// //             placeholder="you@example.com"
// //             value={email}
// //             onChange={(event) => setEmail(event.target.value)}
// //             required
// //           />

// //           <button type="submit">
// //             Send OTP
// //           </button>
// //         </form>

// //         <p className="footer-text">
// //           Secure login for developers
// //         </p>

// //       </div>
// //     </div>
// //   )
// // }


// // export default App



// // NEWWWWWWWWWWWWWWWWWWWWWWWWWW

// import { useState } from 'react'
// import './App.css'

// function App() {
//   const [email, setEmail] = useState('')
//   const [otp, setOtp] = useState('')
//   const [otpSent, setOtpSent] = useState(false)
//   const [message, setMessage] = useState('')

//   async function handleSubmit(event) {
//     event.preventDefault()
//     setMessage('')

//     try {
//       const response = await fetch('http://localhost:5000/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email })
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         setMessage(result.message || 'Could not send OTP')
//         return
//       }

//       setOtpSent(true)
//       setMessage('OTP sent! Please check your email.')
//     } catch (error) {
//       setMessage('Cannot connect to server.')
//     }
//   }

//   async function handleVerify(event) {
//     event.preventDefault()
//     setMessage('')

//     try {
//       const response = await fetch('http://localhost:5000/verify-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, otp })
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         setMessage(result.message || 'OTP verification failed')
//         return
//       }

//       setMessage('Login successful! Welcome to Git Clone 🎉')
//     } catch (error) {
//       setMessage('Cannot connect to server.')
//     }
//   }

//   return (
//     <div className="page">
//       <div className="login-card">
//         <div className="logo">GC</div>

//         <h1>Welcome back!</h1>

//         <p className="subtitle">
//           Sign in to continue to Git Clone
//         </p>

//         <form onSubmit={handleSubmit}>
//           <label htmlFor="email">Email address</label>

//           <input
//             id="email"
//             type="email"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(event) => setEmail(event.target.value)}
//             required
//             disabled={otpSent}
//           />

//           <button type="submit" disabled={otpSent}>
//             Send OTP
//           </button>
//         </form>

//         {otpSent && (
//           <form onSubmit={handleVerify}>
//             <label htmlFor="otp">Enter 6-digit OTP</label>

//             <input
//               id="otp"
//               type="text"
//               inputMode="numeric"
//               maxLength={6}
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(event) => setOtp(event.target.value)}
//               required
//             />

//             <button type="submit">
//               Verify OTP
//             </button>
//           </form>
//         )}

//         {message && <p className="subtitle">{message}</p>}

//         <p className="footer-text">
//           Secure login for developers
//         </p>
//       </div>
//     </div>
//   )
// }

// export default App



// newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww finallllllllllll


import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message || 'Could not send OTP')
        return
      }

      setStep(2)
      setMessage('OTP sent! Check your email.')
    } catch (error) {
      setMessage('Cannot connect to server.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message || 'OTP verification failed')
        return
      }

      setStep(3)
      setMessage('Your email has been verified!')
    } catch (error) {
      setMessage('Cannot connect to server.')
    } finally {
      setLoading(false)
    }
  }

  function goBack() {
    setStep(1)
    setOtp('')
    setMessage('')
  }

  return (
    <div className="page">
      <div className="login-card">
        <header className="brand">
          <div className="logo">CC</div>
          <div>
            <h2>CommitCanvas</h2>
            <p>Git Learning Platform</p>
          </div>
        </header>

        <p className="tagline">
          Master Git, one commit at a time. Learn · Practice · Grow ✨
        </p>

        <div className="progress">
          {['Login', 'OTP', 'Verified', 'Confirm'].map((label, index) => (
            <div className="progress-step" key={label}>
              <div className={`progress-line ${step >= index + 1 ? 'active' : ''}`} />
              <span className={step === index + 1 ? 'current' : ''}>
                {index + 1}. {label}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <h1>Welcome Back!</h1>
            <p className="subtitle">Login to continue your Git journey</p>

            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email ID</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button className="text-button" type="button" onClick={() => setMessage('Password recovery is not connected yet.')}>
                Forgot Password / Recover Code?
              </button>

              <button className="main-button" type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Login & Send OTP'}
              </button>
            </form>

            <p className="signup">
              Don't have an account?{' '}
              <button className="text-button" type="button" onClick={() => setMessage('Sign Up is not connected yet.')}>
                Sign Up
              </button>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Check your email</h1>
            <p className="subtitle">
              Enter the 6-digit OTP sent to {email}
            </p>

            <form onSubmit={handleVerify}>
              <label htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                required
              />

              <button className="main-button" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button className="text-button" type="button" onClick={goBack}>
                ← Back to Login
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <div className="success-panel">
            <div className="success-icon">✓</div>
            <h1>You're Verified!</h1>
            <p className="subtitle">
              Your email verification was successful.
            </p>
            <p>Welcome to CommitCanvas 💚</p>

            
<button
  className="main-button"
  type="button"
  onClick={() => {
    setStep(4)
    setMessage('Confirmation complete!')
  }}
>
  Confirm & Continue →
</button>

          </div>
        )}

        
{step === 4 && (
  <div className="success-panel">
    <div className="success-icon">✓</div>
    <h1>Confirmation Complete!</h1>
    <p className="subtitle">
      Welcome to CommitCanvas!
    </p>
    <p>Your email verification is complete. You're ready to learn Git!</p>
  </div>
)}


        {message && <p className="message" role="status">{message}</p>}

        <div className="how-it-works">
          <h3>How it works?</h3>
          <p>1. Enter email + password</p>
          <p>2. Receive a one-time verification code</p>
          <p>3. Verify your code to confirm your email</p>
          <p>4. Continue your Git learning journey</p>
        </div>
      </div>
    </div>
  )
}

export default App
