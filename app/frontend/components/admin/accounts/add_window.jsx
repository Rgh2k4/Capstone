function Add({onClose, role, setRole}) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handleAdd() {
    alert("Account Created!");
    setRole("");
    onClose();
  }

  return (
    <div className=' p-12 rounded flex flex-col justify-center text-center space-y-24'>
        <div className='flex justify-center text-center text-4xl font-bold'>
            <p>Add {role}</p>
        </div>
        <div className='flex flex-col space-y-6'>
            <input value={username} onChange={setUsername} type="text" placeholder="Enter Username..." className="input"/>
            <input value={password} onChange={setPassword} type="text" placeholder="Enter Password..." className="input"/>
            <input value={email} onChange={setEmail} type="text" placeholder="Enter Email..." className="input"/>
        </div>
        <div>
            <button onClick={handleAdd}>Add</button>
        </div>
    </div>
    
  )
}

export default Add