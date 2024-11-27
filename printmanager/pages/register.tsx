import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    const formData = {
      email: email,
      password: password,
      name: name, 
    };
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          setError(data.error);
        } else {
          await signIn('credentials', {
            email: email,
            password: password,
            callbackUrl: '/',
          });
          window.location.href = '/logged/home';
        }
      });

  };

  return (
    <>
      <div className="flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-800 to-purple-900 w-screen h-screen">
        <img
            src = './backgroundGear.svg'
            height={800}
            width={800}
            className= "absolute top-0 left-0 w-auto h-full object-contain transform -translate-y-1/2 -translate-x-1/2 max-w-md md:max-w-2xl lg:max-w-xl"
          />
          <img
            src = './backgroundGear.svg'
            height={800}
            width={800}
            className= "absolute top-0 right-0 w-auto h-full object-contain transform -translate-y-1/2 translate-x-1/2 max-w-md md:max-w-2xl lg:max-w-xl"
          />

        <form
          onSubmit={handleSubmit}
          className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-sm"
        >
          <h2 className="text-2xl  font-bold mb-6 text-center">Register</h2>
          <label htmlFor='credentials-name' className="block mb-2 "/>
            Name
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              onChange={(e) => setName(e.target.value)}

            />
          <label htmlFor="credentials-email" className="block mb-2 ">
            Email
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

         

          <label htmlFor="credentials-password" className="block mb-4 ">
            Password
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label htmlFor="credentials-confirm-password" className="block mb-4 ">
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="text-black w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="text-[#7c1d1d] mb-4 font-bold">{error}</p>}

          <input
            type="submit"
            value="Register"
            className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-400 transition-colors cursor-pointer mb-4"
          />
        </form>
      </div>
    </>
  );
}
