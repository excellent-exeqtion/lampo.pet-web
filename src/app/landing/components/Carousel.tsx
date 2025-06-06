"use client";
import { useState } from "react";
import styles from "../landing.module.css";

const pets = [
    {
        name: "Camus",
        image: "/images/camus.png",
        description: (
            <>
                <b>Camus, el gato que maúlla con alma de trovador.</b><br />
                Camus no es un gato común, y él lo sabe. Un maullido que podría rivalizar con una ópera completa,
                Nació sin raza, pero con personalidad de sobra: miedoso cuando se enfrenta a lo desconocido,
                juguetón como un eterno cachorro. Aunque su tamaño pueda engañar, por dentro es todo corazón, con
                un alma dulce que busca caricias y atención a cada paso. Camus no es solo una mascota. Es un
                amigo, un compañero leal, un peludo filósofo que observa el mundo desde la ventana y luego lo
                comenta con un maullido. En esa casa no hay silencios incómodos, porque Camus siempre tiene algo
                que decir.
            </>
        ),
    },
    {
        name: "Polar",
        image: "/images/polar.png",
        description: (
            <>
                <b>Polar, es un perro escapista, un mago en todo aspecto.</b><br />
                Polar no es cualquier perrito, y créeme, él lo tiene clarísimo. Experto en besitos sorpresa, y
                detector oficial de manos libres para acariciar. La vida le puso a prueba desde los 20 días,
                cuando perdió a su mamá, pero fue alimentado cada dos horas, como si ya supiera que tenía un
                destino especial. Y desde pequeño dejó claro quién manda —spoiler: él— con esa energía, es un
                torbellino peludo que convierte cualquier rincón en una zona de amor. En casa, es puro amor. En el
                parque, el alma de la fiesta. Polar no es solo un perro, es una vibra: ternura, travesura y
                corazón en cuatro patas.
            </>
        ),
    },
    {
        name: "Arya",
        image: "/images/arya.png",
        description: (
            <>
                <b>Arya, una princesa saltarina que supera desafíos.</b><br />
                Arya no empezó la vida fácil. Con sus patitas de “perro nadador”, muchos pensaron que no
                caminaría. Pero ella decidió que no estaba aquí para rendirse. Superó eso, y cuando la vida le
                quitó el movimiento de la cola, también le plantó cara. Después fue madre. Perdió a uno, pero le
                dio amor infinito a los que quedaron. Arya es la princesa de la casa. Dulce, sí. Pero con
                carácter. Ama su pancita sobada, su historia no se cuenta con lástima, se celebra con orgullo.
                Porque Arya es eso: una historia de amor que no se rinde.
            </>
        ),
    },
    {
        name: "Toby",
        image: "/images/toby.png",
        description: (
            <>
                <b>Toby, un perro celosamente amoroso.</b><br />
                Toby es el sabio de la casa, el más viejo, el más tierno. Tiene una obsesión encantadora con los
                gatos y un corazón enorme, aunque no le pidas que comparta su cama o sus juguetes —esas son cosas
                sagradas. Vivió en la calle, sí, pero ahora vive en el amor. Desde que fue adoptado, no hay día
                que no agradezca con esa mirada tranquila, esa pata que pone encima tuyo para decirte: &quot;ya basta,
                es hora de quererme&quot;. Es el perro fiel que todos sueñan tener. Educado, juguetón, algo celoso, y
                con un ladrido raro que nadie le discute. Aunque sus riñones lo obliguen a una dieta especial, su
                alma es libre, feliz, y más viva que nunca. Toby es eso: el amor hecho perro.
            </>
        ),
    },
    {
        name: "Happy",
        image: "/images/happy.png",
        description: (
            <>
                <b>Happy, un gato amante de las delicatessen.</b><br />
                Happy no es cualquier gato. Es un sobreviviente con alma de drama y diente dulce: su debilidad, la
                sandía. Una vez lo encontraron con la boca roja, parado junto a la evidencia como si nada.
                Culpable, sí. Arrepentido, jamás. A veces exige mimos como una diva mimada, en otras simplemente
                observa con desdén felino. Tiene gustos peculiares (sí, de esos que no se comentan en cenas
                familiares), pero jamás pierde la elegancia. Happy es muchas cosas: extraño, encantador y
                ligeramente ridículo.
            </>
        ),
    },
    {
        name: "Pelusa",
        image: "/images/pelusa.png",
        description: (
            <>
                <b>Pelusa, la gata peligrosamente diva.</b><br />
                Pelusa nació en el campo, pero la ciudad le sienta como a una reina. Desde que llegó, dejó claro
                que no era una más: es la matrona, la diva, la que camina como si cada pasillo fuera pasarela.
                Siempre impecable, siempre altiva. Aprendió a defenderse desde pequeña y no le tiemblan los
                bigotes para poner límites. Tiene carácter: no le gusta compartir espacios, ni camas, ni
                protagonismo. Pelusa no es solo una gata, es presencia. Una reina sin corona —porque no la
                necesita.
            </>
        ),
    },
    {
        name: "Gaia",
        image: "/images/gaia.png",
        description: (
            <>
                <b>Gaia, la gatita atrevidamente cariñosa.</b><br />
                Gaia no llegó a la colonia con una bienvenida, pero eso a ella no le importó. Se ganó su lugar con
                garras, mirada fija y cero disculpas. Desde pequeña era una mezcla curiosa: cariñosa de a ratos,
                arisca cuando le daba la gana, pero siempre con esa elegancia felina que impone respeto. Le
                encantaba dar besitos y amasar el pecho de sus humanos como quien marca territorio con ternura.
                Hoy, es el alma de la fiesta: juguetona, preciosa, talento especial y nunca pasa desapercibida.
                Todos la aman, claro, pero también la respetan. Porque con ella, se juega cuando ella quiere... y
                se le adora sin condiciones.
            </>
        ),
    },
    {
        name: "Cherry",
        image: "/images/cherry.png",
        description: (
            <>
                <b>Cherry, la suave gata sin prejuicios.</b><br />
                Cherry es puro amor envuelto en suavidad. Fue rescatada, una historia dura —dos ratas, y un
                destino que cambió justo a tiempo—, y desde entonces no ha conocido más que cariño y calor de
                hogar. Desde que alguien cruza la puerta, ella es la primera en saludar, como si supiera que el
                amor se devuelve con más amor. Le da igual si la aplastan o si ella es la que ocupa toda la cama,
                mientras que haya compañía. Ahora, con cuerpo de peluche y dieta “controlada”, ha aprendido el
                arte de derretirse en el piso para exigir caricias. Cherry no solo es una gata: es un regalo, una
                presencia suave que llena la casa de ternura, mañas y esa vibra dulce de quien sabe que fue
                salvada… y decidió quedarse para amar.
            </>
        ),
    },
    {
        name: "Oni",
        image: "/images/oni.png",
        description: (
            <>
                <b>Oni, una felina madre adoptiva, intensa con su amor.</b><br />
                Oni llegó con una patita quemada, chiquita y frágil, pero con una ternura que desbordaba fuerza.
                Sus humanos no lo dudaron: la abrazaron con todo el amor que tenían, y ella les devolvió el gesto
                convirtiéndose en el corazón suave de la casa. Fue más que una hermana para los otros gatos: fue
                mamá, cuidadora, guía. Los consiente y los regaña. Dormir con ellos no es solo costumbre, es su
                forma de protegerlos, Oni es educada, tranquila y tan graciosa sin proponérselo, uno no puede más
                que sonreír con ella. Cada vez que encuentra una mano, exige caricias. Porque Oni, sin alardes, es
                ejemplo, amor y dulzura hecha gata.
            </>
        ),
    },
];

export default function Carousel() {
    const [current, setCurrent] = useState(0);
    const total = pets.length;

    const prev = () => setCurrent((c) => (c === 0 ? total - 1 : c - 1));
    const next = () => setCurrent((c) => (c === total - 1 ? 0 : c + 1));

    return (
        <>
            <div className={styles.carousel}>
                <button className={styles.carouselBtn} onClick={prev} aria-label="Anterior">
                    &#8592;
                </button>
                <div className={styles.carouselCard} style={{ height: '920px !important', minWidth: '250px !important' }}>
                    <img src={pets[current].image} alt={pets[current].name} width={200} />
                    <h2>
                        <b>{pets[current].name}</b>
                    </h2>
                    <p style={{ textAlign: "justify" }}>{pets[current].description}</p>
                </div>
                <button className={styles.carouselBtn} onClick={next} aria-label="Siguiente">
                    &#8594;
                </button>
            </div>
            <div className={styles.carouselIndicators}>
                {pets.map((_, i) => (
                    <span
                        key={i}
                        className={i === current ? styles.activeDot : styles.dot}
                        onClick={() => setCurrent(i)}
                    ></span>
                ))}
            </div>
        </>
    );
}
