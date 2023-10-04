import { useSearchParams } from 'react-router-dom'

const usePortfolioQuery = () => {
  const [searchParams] = useSearchParams()
  console.log(searchParams.get('pid'))
}

export default usePortfolioQuery