import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import allPortfolioData from '../data/portfolio.json'

const TypedPortfolioData: Record<string, string> = allPortfolioData
const usePortfolioQuery = () => {
  const [searchParams] = useSearchParams()
  const pid = searchParams.get('pid')
  const portfolioData: string | undefined =
    useMemo(() => { if (pid) return TypedPortfolioData[pid] }, [searchParams])
  return { portfolioData, pid: portfolioData ? pid : undefined }
}

export default usePortfolioQuery