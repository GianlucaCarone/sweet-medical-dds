import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
export default function SkeletonTurno () {
  return (
    <Card variant='outlined' sx={{ mb: 1.5, borderRadius: 3 }}>
      {' '}
      <CardContent>
        {' '}
        <Skeleton width='60%' height={24} sx={{ mb: 0.5 }} />{' '}
        <Skeleton width='40%' height={18} sx={{ mb: 1.5 }} />{' '}
        <Skeleton width='80%' height={18} sx={{ mb: 1.5 }} />{' '}
        <Skeleton variant='rectangular' height={36} sx={{ borderRadius: 2 }} />{' '}
      </CardContent>{' '}
    </Card>
  )
}
