import Link from '@mui/material/Link/Link';
import InfoIcon from '@mui/icons-material/Info';

export const InfoLink = ({ link }: { link: string }) => {
    return (
        <Link href={link} target='_blank' sx={{ height: '1.25rem' }}>
            <InfoIcon fontSize='small' />
        </Link>
    )
}
