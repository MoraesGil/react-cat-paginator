import Image from 'react-bootstrap/Image'

const CatDetails = ({ cat }) => {
    if (!cat) {
        return null
    }
    return (
        <>
            {cat.id}
            <Image src={cat.url} fluid />
        </>
    )
}

export default CatDetails;