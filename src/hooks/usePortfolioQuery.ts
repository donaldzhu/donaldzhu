import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import allPortfolioData from '../data/portfolio.json'

interface PortfolioDataInterface {
  employer: string
  projects: string[]
}

const typedPortfolioData: Record<string, PortfolioDataInterface> = allPortfolioData
const usePortfolioQuery = () => {
  const [searchParams] = useSearchParams()
  const pid = searchParams.get('pid')
  const portfolioData: PortfolioDataInterface | undefined = useMemo(() => { if (pid) return typedPortfolioData[pid] }, [searchParams])
  useEffect(() => {
    if (pid && portfolioData)
      sessionStorage.setItem('pid', pid)
  }, [searchParams])
  return { portfolioData, pid: portfolioData ? pid : undefined }
}

export default usePortfolioQuery