
// const express = require('express')
// const cors = require('cors')
// require('dotenv').config()

// const { Resend } = require('resend')

// const app = express()

// app.use(cors())
// app.use(express.json())

// const resend = new Resend(process.env.RESEND_API_KEY)

// app.get('/', (req, res) => {
//   res.send('Git Clone OTP server is running!')
// })

// app.post('/send-otp', async (req, res) => {
//   try {
//     const { email } = req.body

//     if (!email) {
//       return res.status(400).json({
//         message: 'Email is required'
//       })
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString()

//     const { data, error } = await resend.emails.send({
//       from: process.env.FROM_EMAIL,
//       to: email,
//       subject: 'Your Git Clone Login OTP',
//       html: `<h2>Your OTP is ${otp}</h2><p>This code is for your Git Clone login.</p>`
//     })

//     if (error) {
//       console.error('Resend error:', error)
//       return res.status(500).json({
//         message: 'Email could not be sent. Check your Resend settings.'
//       })
//     }

//     console.log('Email sent:', data.id)

//     res.json({
//       message: 'OTP email sent successfully'
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       message: 'Something went wrong'
//     })
//   }
// })

// const PORT = 5000
// const server = app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`)
// })

// server.on('close', () => {
//   console.log('Server has closed')
// })

// server.on('error', (error) => {
//   console.error('Server error:', error)
// })


// // app.listen(PORT, () => {
// //   console.log(`Server running at http://localhost:${PORT}`)
// // })



const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
require('dotenv').config()

const { Resend } = require('resend')

const app = express()
const resend = new Resend(process.env.RESEND_API_KEY)

// Temporary OTP storage
const otpStore = new Map()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Git Clone OTP server is running!')
})

// Send OTP
app.post('/send-otp', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase()

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      })
    }

    const otp = crypto.randomInt(100000, 1000000).toString()
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex')

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Your Git Clone Login OTP',
      html: `
        <h2>Your Git Clone OTP is ${otp}</h2>
        <p>This code expires in 5 minutes.</p>
        <p>If you did not request this code, ignore this email.</p>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({
        message: 'Email could not be sent'
      })
    }

    otpStore.set(email, {
      hash: otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    })

    console.log('OTP email sent:', data.id)

    res.json({
      message: 'OTP sent successfully. Check your email.'
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({
      message: 'Something went wrong'
    })
  }
})

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const otp = String(req.body.otp ?? '').trim()

  if (!email || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      message: 'Enter your email and 6-digit OTP'
    })
  }

  const savedOtp = otpStore.get(email)

  if (!savedOtp) {
    return res.status(400).json({
      message: 'Please request a new OTP'
    })
  }

  if (Date.now() > savedOtp.expiresAt) {
    otpStore.delete(email)
    return res.status(400).json({
      message: 'OTP expired. Please request a new one.'
    })
  }

  if (savedOtp.attempts >= 5) {
    otpStore.delete(email)
    return res.status(429).json({
      message: 'Too many attempts. Please request a new OTP.'
    })
  }

  const submittedHash = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex')

  if (submittedHash !== savedOtp.hash) {
    savedOtp.attempts += 1

    if (savedOtp.attempts >= 5) {
      otpStore.delete(email)
    }

    return res.status(400).json({
      message: 'Incorrect OTP. Please try again.'
    })
  }

  otpStore.delete(email)

  res.json({
    message: 'Login successful!'
  })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
