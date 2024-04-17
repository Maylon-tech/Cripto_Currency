import { FormEvent, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsSearch } from 'react-icons/bs'
import styles from './home.module.css'

export interface CoinProps {
  id: string
  name: string
  symbol: string
  priceUsd: string
  vwap24Hr: string
  changePercent24Hr: string
  rank: string
  supply: string
  maxSupply: string
  marketCapUsd: string
  volumeUsd24Hr: string
  explorer: string
  formatedPrice?: string
  formatedMarket?: string
  formatedVolume?: string
}

interface  DataProp {
  data: CoinProps[]
}

const Home = () => {
  const [input, setInput] = useState("")  // Valor do Input
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    getData()
  }, [offset])

  async function getData() {
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
      .then(response => response.json())
      .then((data: DataProp) => {
        const coinsData = data.data

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        })
        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact"
        })

        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
          }
          return formated
        })

        const listCoins = [...coins, ...formatedResult]
        setCoins(listCoins)
        //console.log(formatedResult)
      })

  }

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()
    if(input === "") return   // Se clicou sem preencher - nao faz nada
    // Redireciona para Rota procurado no Search
    navigate(`/detail/${input}`)

    console.log(input)
  }

  // Button para Recarregar mais item na pagina
  const handleGetMore = () => {
    if(offset === 0) {
      setOffset(10)
      return
    }

    setOffset(offset + 10)
  }

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit} action="#" className={styles.form}>
        <input 
          type="text"
          placeholder="Digite o nome da moeda"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit"
        >
          <BsSearch size={38} color='#fff' />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor mercado</th>
            <th scope='col'>Preco</th>
            <th scope='col'>Volume</th>
            <th scope='col'>Mudanca 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {
            coins.length > 0 && coins.map((item) => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.tdLabel} data-label="Moeda">
                  <div className={styles.name}>
                    <img 
                      className={styles.logo}
                      src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                      alt="Logo cripto" 
                    />
                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>
                <td className={styles.tdLabel} data-label="Valor marcado">
                  {item.formatedMarket}
                </td>
                <td className={styles.tdLabel} data-label="Preco">
                  {item.formatedPrice}
                </td>
                <td className={styles.tdLabel} data-label="Volume">
                  {item.formatedVolume}
                </td>
                <td 
                  className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} 
                data-label="Mudanca 24h">
                  <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

    <button className={styles.buttonMore} onClick={handleGetMore}>
      Carregar mais
    </button>

    </main>
  )
}

export default Home