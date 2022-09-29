import Link from '@mui/material/Link/Link';
import HelpIcon from '@mui/icons-material/Help';

export const InfoLink = ({ link }: { link: string }) => {
    return (
        <Link href={link} target='_blank' sx={{ height: '1.25rem' }}>
            <HelpIcon fontSize='small' />
        </Link>
    )
}
