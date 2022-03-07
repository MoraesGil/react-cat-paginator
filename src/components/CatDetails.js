import Image from 'react-bootstrap/Image'

const CatDetails = ({ cat }) => { 
    return (
        <>
            {cat.id}
            <Image src={cat.url} fluid/>
        </>
    )
}

export default CatDetails;