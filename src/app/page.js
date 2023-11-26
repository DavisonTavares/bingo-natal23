/*client-side*/
"use client"
import { initializeApp } from "firebase/app"
import { collection, addDoc, getDoc, getFirestore } from 'firebase/firestore';
import React from "react"
import { useEffect } from "react"

export default function Home() {
    let numberGenerated = []
    const [cupom, setCupom] = React.useState(null)
    let bd
    useEffect(() => {
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyCJ3MtPTqVTGmoo5wsQYfP4_3vi4gBqjlI",
            authDomain: "natal-2023-5446b.firebaseapp.com",
            projectId: "natal-2023-5446b",
            storageBucket: "natal-2023-5446b.appspot.com",
            messagingSenderId: "1035169669639",
            appId: "1:1035169669639:web:a136c7803d88dddf3400a2"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        bd = getFirestore(app);
        const fetchData = async () => {
            try {
                const data = await getDocs(collection(bd, 'cupons'));
                const numbers = [];
                data.forEach((doc) => {
                    numbers.push(doc.data().number);
                });
                setNumberGenerated(numbers);
            } catch (error) {
                console.error('Error fetching data from Firebase:', error);
            }
        };

        fetchData();
    }, [])

    //envia os dados para o firebase e gera o cupom
    async function handleSubmit(e) {
        e.preventDefault()
        const name = e.target.name.value
        const total = e.target.total.value
        const troco = e.target.troco.value
        console.log(name, total, troco)
        // valida os dados
        if (!name || !total) return alert('Preencha os campos corretamente!')
        if (total < 20) return alert('O valor total da compra deve ser maior que R$ 20,00!')
        if (troco < 0) return alert('O troco da sorte não pode ser menor que 0!')
        // gera o cupom retirando os números já gerados
        let number = Math.floor(Math.random() * 1000)
        while (numberGenerated.includes(number)) {
            number = Math.floor(Math.random() * 1000)
        }
        const cupom = {
            name,
            total,
            troco,
            number
        }
        try {
            const docRef = await collection(bd, 'cupons')
            await addDoc(docRef, cupom)
            console.log("Document written with ID: ", docRef.id);
            alert(`Cupom gerado com sucesso! Seu número é ${number}`)
            setCupom(number)
            //imprime o cupom
            setTimeout(() => {
                window.print()
                setCupom(null)
            }, 500)
                

        }
        catch (e) {
            alert('Erro ao gerar cupom!')
            console.error("Error adding document: ", e);
        }

    }
    return (
        <>
        {!cupom && 
        <main className="flex min-h-screen flex-col items-center justify-between pt-14 px-10">
            <div className="z-10 max-w-xl w-full items-center justify-between font-mono text-sm">
                <div className="flex flex-col items-center justify-center w-full">
                    <h1 className="text-2xl font-bold text-white text-center">
                        COMPRA PREMIADA - NATAL 2023
                    </h1>
                    <p className="text-white text-center">
                        <br />
                        <span className="font-bold">COMPRE E CONCORRA!</span>
                        <br />
                        <hr />
                        A cada R$ 20,00 em compras, você ganha um cupom para concoreer a um
                        <br />
                        <span className="font-bold">1º --- FARDINHO DE SKOL</span>
                        <br />
                        <span className="font-bold">2º --- FARDINHO DE ITAIPAVA</span>
                        <br />
                        CORRE QUE É SÓ ATÉ O NATAL DE 2023!
                        ----------- 24/12/2023 ------------
                    </p>
                    <span className="text-white text-center">
                        A CADA TROCO DA SORTE VOCÊ GANHA UM CUPOM EXTRA!
                        <br />
                        ---- DOBRE SUAS CHANCES DE GANHAR! ----
                        <hr />
                    </span>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full">
                    <label htmlFor="name" className="text-gray-400">
                        Nome do cliente
                    </label>
                    <input required type="text" id="name" className="w-full p-2 text-black border border-gray-400 rounded-md" />
                    <label htmlFor='total' className="text-gray-400">
                        Valor total da compra
                    </label>
                    <input required type="number" id="total" className="w-full p-2 border text-black border-gray-400 rounded-md" />
                    <label htmlFor='troco' className="text-gray-400">
                        TROCO DA SORTE
                    </label>
                    <input rtza23equired type="number" id="troco" defaultValue={0} className="w-full text-black p-2 border border-gray-400 rounded-md" />
                    <button type="submit" className="w-full p-2 mt-4 text-white bg-blue-500 rounded-md">
                        GERAR CUPOM
                    </button>
                </form>
            </div>
        </main>
        }
        {cupom > 0 &&
        <main className="flex min-h-screen flex-col items-center justify-between pt-14 px-10">
        <div className="z-10 max-w-xl w-full items-center justify-between font-mono text-sm">
            <div className="flex flex-col items-center justify-center w-full">
                <h1 className="text-2xl font-bold text-white text-center">
                    COMPRA PREMIADA - NATAL 2023
                </h1>
                <p className="text-white text-center">
                    <br />
                    <br />
                    <hr />
                    <br />
                    <br />
                    <br />
                </p>
                <h1 className="text-2xl font-bold text-white text-center">
                    ## CUPOM ##
                </h1>
                <h1 className="text-2xl font-bold text-white text-center">
                    {cupom}
                </h1>
                <p className="text-white text-center">
                    <br />
                    <br />
                    <hr />
                </p>
            </div>
        </div>
    </main>    

        }
        </>
    )
}
