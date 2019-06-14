export const uuidv4 = () => {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))) // eslint-disable-line no-undef
			.toString(16)
	)
}

export const roundToTwo = (num)  =>{
	return +(Math.round(num + 'e+2') + 'e-2')
}
export const prettyValue = (value) =>{
	
	if (value > 1000000) {
		return `${roundToTwo(value / 1000000)}m`
	}

	if (value > 1000) {
		return `${roundToTwo(value / 1000)}k`
	}

	return `${roundToTwo(value)}`
}
