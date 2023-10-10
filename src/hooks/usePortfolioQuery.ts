import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import allPortfolioData from '../data/portfolio.json'

const usePortfolioQuery = () => {
  const [searchParams] = useSearchParams()
  const pid = searchParams.get('pid')
  const portfolioData = useMemo(() => { if (pid) return allPortfolioData[pid] }, [searchParams])
  useEffect(() => {
    if (pid && portfolioData)
      sessionStorage.setItem('pid', pid)
  }, [searchParams])
  return { portfolioData, pid: portfolioData ? pid : undefined }
}

export default usePortfolioQuery