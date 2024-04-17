import styles from './detail.module.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CoinProps }from '../home'

interface ResponseData {
  data: CoinProps
}
interface ErrorData {
  error: string
}

type DataProps = ResponseData | ErrorData

const Detail = () => {
  const navigate = useNavigate()
  const { cripto } = useParams()

  const [coins, setCoins] = useState<CoinProps>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://api.coincap.io/v2/assets/${cripto}`)
          .then(response => response.json())
          .then((data: DataProps) => {
              // Tratamento
            if("error" in data) {
              navigate("/")
              return
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            })
            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact"
            })
            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
              formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr))
            }
            setCoins(resultData)
            setLoading(false)
          })
      } catch(err) {
        console.log(err)
        navigate("/")
      }
    }

    getCoin()
  }, [cripto])

  if(loading || !coins) {
    return (
      <div className={styles.container}>
        <h3 className={styles.center}>Carregando Detalhes...</h3>
      </div>
    )
  }

  const handleBack = () => {
    navigate("/")
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coins?.name}</h1>
      <h1 className={styles.center}>{coins?.symbol}</h1>

      <section className={styles.content}>
        <img 
          src={`https://assets.coincap.io/assets/icons/${coins?.symbol.toLowerCase()}@2x.png`} 
          alt="Logo da Moeda"
          className={styles.logo} 
        />
        <h1 className={styles.name}>
          {coins?.name} | {coins?.symbol}
        </h1>

        <p>
          <strong>Preco </strong>{coins?.formatedPrice}
        </p>

        <a href="#">
          <strong>Mercado: </strong> {coins?.formatedMarket}
        </a>

        <a href="#">
          <strong>Volume: </strong> {coins?.formatedVolume}
          <span
            className={Number(coins?.changePercent24Hr) > 0 ? styles.profit : styles.loss }
          >
           {Number(coins?.changePercent24Hr).toFixed(2)}
          </span>
        </a>
      </section>

      <button className={styles.backBtn} onClick={handleBack}>
        Voltar
      </button>
    </div>
  )
}

export default Detail