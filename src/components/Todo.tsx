
import { useRef, useState } from 'react'
import { RiCalendarTodoLine } from 'react-icons/ri';
import TodoItems from './TodoItems';

interface TodoObject {
    id: number,
    text: string|undefined,
    isComplete: boolean
};

const Todo = () => {
    const [todoList, setTodoList] = useState<TodoObject[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const add = () => {
        const inputText:string | undefined =  inputRef.current?.value.trim();
        console.log(inputText);
        if(inputText === '')
            return null;
        const newTodo: TodoObject = {
            id: Date.now(),
            text: inputText,
            isComplete: false,
        }
        setTodoList((prev) => [...prev, newTodo]);
        if(inputRef.current)
            inputRef.current.value='';    
        
    }
    const deleteTodo = (id: number) => {
        setTodoList((prevTodos: TodoObject[]) => {
            return prevTodos.filter((todo) => todo.id !== id);
        });
    }
    const toggleChecked = (id: number) => {
        setTodoList((prevTodos: TodoObject[]) => {
            return prevTodos.map((todo) => {
                if(todo.id === id){
                    return {...todo, isComplete: !todo.isComplete}
                }
                return todo;
            });
        });
    }
    return (
        <div className='bg-white place-self-center w-11/12 max-w-md
        flex flex-col p-7 min-h-[550px] rounded-xl'>

            <div className='flex items-center mt-7 gap-2'>
                <RiCalendarTodoLine className='w-8 h-12'/>
                <h1 className='text-3xl font-semibold'>To-Do List</h1>
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
    )
}

export default Todo;