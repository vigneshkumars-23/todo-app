
import { useEffect, useRef, useState } from 'react'
import { RiCalendarTodoLine } from 'react-icons/ri';
import TodoItems from './TodoItems';
import { useGoogleLogin } from '@react-oauth/google';
import { googleSignIn } from '../services/APIServices';
import { Avatar, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react';
import { CgProfile } from 'react-icons/cg';
import { PiSignOutBold } from 'react-icons/pi';
import { BackendResponse, TodoObject, UserInfo } from '../constants/Models';
import { updateTodosAPI } from '../interceptor/axiosConfig';


const Todo = () => {
    const [todoList, setTodoList] = useState<TodoObject[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(checkValidAccessToken()){
            googleLoginBackendCall();
        }
    },[]);
    useEffect(() => {
        if(userInfo?.todos){
            setTodoList(userInfo.todos);
        }
    },[userInfo])
    const checkValidAccessToken = () => {
        const googleAccessToken = localStorage.getItem('todoGoogleAccessToken');
        const googleAccessTokenExpires = Number(localStorage.getItem('todoGoogleAccessTokenExpiresAt'));
        if(googleAccessToken && googleAccessTokenExpires && (Date.now() < googleAccessTokenExpires)){
            return true;
        } else{
            localStorage.removeItem('todoGoogleAccessToken');
            localStorage.removeItem('todoGoogleAccessTokenExpiresAt');
            return false;
        }
    }
    const add = async () => {
        const inputText:string | undefined =  inputRef.current?.value.trim();
        console.log(inputText);
        if(inputText === '')
            return null;
        const newTodo: TodoObject = {
            id: Date.now(),
            text: inputText,
            isComplete: false,
        }
        const temp = [...todoList, newTodo];
        setTodoList((prev) => [...prev, newTodo]);
        if(inputRef.current)
            inputRef.current.value='';
            try{
                const response = await updateTodo(temp);
                if(response.status !== 200)
                    throw new Error('DB update failed');
            }catch(error){
                console.log(error);
                let temp: TodoObject[] = [...todoList];
                if(temp.length > 0)
                    temp = temp.slice(0,-1);
                else
                    temp = [];
                setTodoList(temp);
        }
    }    

    const updateTodo = async(todos: TodoObject[]) => {
        return await updateTodosAPI(
            {
                email: userInfo?.email,
                todos: todos
            }
        );
    }
    const deleteTodo = async(id: number) => {
        const originalTemp: TodoObject[] = [...todoList];
        const temp: TodoObject[] = originalTemp.filter((todo) => todo.id !== id);
        setTodoList(temp);
        try{
            const response = await updateTodo(temp);
            if(response.status !== 200)
                throw new Error('DB update failed!');
        } catch(error){
            console.log(error);
            setTodoList(originalTemp);
        }
        setTodoList((prevTodos: TodoObject[]) => {
            return prevTodos.filter((todo) => todo.id !== id);
        });
    }
    const toggleChecked = async (id: number) => {
        const currentTodo = todoList;
        const newTodo = currentTodo.map((todo) => {
            if(todo.id === id){
                return {...todo, isComplete: !todo.isComplete}
            }
            return todo;
        });
        try{
            setTodoList(newTodo);
            const response = await updateTodo(newTodo);
            if(response.status !== 200)
                throw new Error('DB update failed!');
        } catch(error){
            console.log(error);
            setTodoList(currentTodo);
        }

    }
    const login =  useGoogleLogin({
        onSuccess: (response) => {
            console.log(response);
            localStorage.setItem('todoGoogleAccessToken', response.access_token);
            localStorage.setItem('todoGoogleAccessTokenExpiresAt', (Date.now() + response.expires_in * 1000).toString());
            setTimeout(() => googleLoginBackendCall(), 100);
        },
        flow: 'implicit',
    });

    const googleLoginBackendCall = async () => {
        try{
            setLoading(true);
            const googleAccessToken = localStorage.getItem('todoGoogleAccessToken');
            if(!googleAccessToken)
                throw Error('Access Token Not found!');
            const response: BackendResponse = await googleSignIn(googleAccessToken);
            console.log(response);
            if(response.status !== 200){
                throw new Error(response.message);
            }
            setUserInfo(response.data);
            setLoading(false);
        } catch(error){
            console.log(error);
            setLoading(false);
        }
    }

    const signOut = () => {
        setUserInfo(undefined);
        setTodoList([]);
        localStorage.removeItem('todoGoogleAccessToken');
        localStorage.removeItem('todoGoogleAccessTokenExpiresAt');
    }

    return (
        <div className='bg-white place-self-center w-11/12 max-w-md
        flex flex-col p-7 min-h-[550px] rounded-xl'>
            {!loading && 
            <div>
                <div className='flex items-center mt-7 gap-2 justify-between'>
                    <div className='flex w-60'>
                        <RiCalendarTodoLine className='w-8 h-12'/>
                        <h1 className='text-3xl m-1 font-semibold'>To-Do List</h1>
                    </div>
                    {!userInfo && <button
                    className='gsi-material-button ml-4'
                    onClick={() => login()}
                    >
                        <div className='gsi-material-button-state'></div>
                        <div className='gsi-material-button-content-wrapper'>
                        <div className='gsi-material-button-icon'>
                            <svg
                            version='1.1'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 48 48'
                            style={{ display: 'block' }}
                            >
                            <path
                                fill='#EA4335'
                                d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                            ></path>
                            <path
                                fill='#4285F4'
                                d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                            ></path>
                            <path
                                fill='#FBBC05'
                                d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                            ></path>
                            <path
                                fill='#34A853'
                                d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                            ></path>
                            <path fill='none' d='M0 0h48v48H0z'></path>
                            </svg>
                        </div>
                        <span className='gsi-material-button-contents'>
                            Sign in with Google
                        </span>
                        <span style={{ display: 'none' }}>Sign in with Google</span>
                        </div>
                    </button>}
                    {userInfo && <div className='mr-2'>
                        <Menu>
                            <MenuHandler>
                                <Avatar
                                    variant='circular'
                                    alt={userInfo.name}
                                    src={userInfo.photo}
                                    className='cursor-pointer rounded-3xl' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
                                />
                            </MenuHandler>
                            <MenuList placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <MenuItem className='flex items-center gap-3 ml-2 mr-2 mt-1' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <CgProfile />
                                    <Typography variant='small' className='font-medium' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        My Profile
                                    </Typography>
                                </MenuItem>
                                <hr className='my-2 border-blue-gray-50' />
                                <MenuItem onClick={() => signOut()} className='flex items-center gap-3 ml-2 mr-2 mt-1 mb-2' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    <PiSignOutBold color='red' />
                                    <Typography variant='small' className='font-medium' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        Sign Out
                                    </Typography>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        </div>
                    }
                </div>

                <div className='flex items-center my-7 bg-gray-200
                rounded-full'>
                    <input ref={inputRef} className='bg-transparent border-0 outline-none
                    flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600' type='text' placeholder='Add your Task' />
                    <button className='border-none rounded-full bg-purple-600 w-32 h-14 text-white
                    text-lg font-medium cursor-pointer' onClick={add}>ADD +</button>
                </div>
                <div className='flex flex-col'>
                    {todoList.map((task, index) => (
                        <TodoItems key={index} text={task.text} isComplete={task.isComplete} id={task.id} deleteTodo={deleteTodo} toggleChecked={toggleChecked}/>
                    ))}
                </div>
            </div>
            }
            {loading && 
                <div style={{margin: 'auto auto'}}>
                    <div className='text-center'>
                        <div role='status'>
                            <svg aria-hidden='true' className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor'/>
                                <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill'/>
                            </svg>
                            <span className='sr-only'>Loading...</span>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Todo;