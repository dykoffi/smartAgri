export function ask(text, data) {
    if (/informations sur la plante/.test(text)) {
        return `
        Les informations de la plante sont.
        Stade de la culture. 16 eme jour.
        Type de culture. tomate.
        Variété de la culture. tomate cérise.
        Etat de santé. bon.
        Type de port. croissance determinée.
       `
    } else if (/(quelles sont les)? ?(conditions) (météorologiques|météo)/.test(text)) {
        return `
        Les conditions météorologiques sont.
        Température . 27 dégré celcus.
        Humidité du sol. 52%.
        Humidité de l'air. 63%.
        Luminosité. 152 lux.
       `
    }else {
        return null
    }
}