import Badge from 'react-bootstrap/Badge'
import Image from 'react-bootstrap/Image'

const renderBadget = (description) => (
    <Badge pill bg="secondary">
        {description}
    </Badge>)

const CatDetails = ({ cat }) => {
    return (
        <>
            <p>
                <strong> Code: {cat.id}</strong>
            </p>
            <p>
                <strong> Breads: </strong>
                {!cat.lenght && (
                    renderBadget("Mutt")
                )}
                {cat.lenght && cat.breeds.map((description) => renderBadget(description))}
            </p>
            <Image src={cat.url} fluid />
        </>
    )
}

export default CatDetails;