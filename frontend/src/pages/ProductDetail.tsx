import { useEffect } from "react"
import { useParams } from "react-router-dom";


export const ProductDetail = ()=>{

    const { id } = useParams<{ id: string }>();
    useEffect(()=>{
        alert('ID DO PRODUTO: '+id)
    },[])

    return (
        <div className="test-center text-xl mt-10">
            Product Detail
        </div>
    )
}