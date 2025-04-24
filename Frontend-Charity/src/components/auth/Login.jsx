// import { useState } from 'react';
// import { loginUser } from '../../api/auth';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     username: '',
//     password: '',
//   });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await loginUser(form);
//       localStorage.setItem('access', res.data.access);
//       localStorage.setItem('refresh', res.data.refresh);
//       alert('Login successful!');
//       navigate('/');
//     } catch (err) {
//       alert('Login failed: ' + (err.response?.data?.detail || 'Try again.'));
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
//       <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input name="username" placeholder="Username" onChange={handleChange} required className="w-full p-2 border rounded" />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
//         <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
