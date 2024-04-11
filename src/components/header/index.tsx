import styles from './header.module.css'
import LogoImg from '../../assets/logo.svg'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className={styles.container}>
      <Link to="/">
        <img src={LogoImg} alt="logo crypto currecy" />
      </Link>
      
    </header>
  )
}

export default Header