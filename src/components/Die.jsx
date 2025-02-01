export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    // Generate dots based on the dice value
    const dots = Array.from({ length: props.value }).map((_, index) => (
        <span key={index} className="dot"></span>
    ));
    return (

        <button
            style={styles}
            className={`die-face ${props.value}`}
            onClick={() => props.hold(props.id)}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, 
            ${props.isHeld ? "held" : "not held"}`}
        >
            <div className="dot-container">{dots}</div>
        </button>

    )
}