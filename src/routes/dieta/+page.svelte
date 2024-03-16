<script lang="ts">
	const diet = [
		[
			{
				lunch: 'Pollo a la plancha o hervido, espinacas o judías verdes, hervidas.',
				dinner:
					'Dos huevos pasados por agua o revueltos, queso o requesón, calabacin hervido o judías verdes, una tostada y café.'
			}
		],
		[
			{
				lunch:
					'Pescado hervido o a la plancha, verduras hervidas o ensalada mixta, una tostada y café.',
				dinner: 'Surtido de quesos sin grasa (menos del 40%), espinacas, una tostada y café.'
			}
		],
		[
			{
				lunch: 'Pollo asado, ensalada de tomates y lechuga, fruta del tiempo.',
				dinner: 'Ensalada mixta, cualquier tipo de fruta y café o té.'
			}
		],
		[
			{
				lunch:
					'Bistec de buey o ternera sin limite de cantidad, pero quitando la grasa, Un solo verde (sin tomate ni cebolla ni otros) y café o té',
				dinner: 'Tomates con zanahorias, pollo, naranja u otra fruta y café, o té.'
			}
		],
		[
			{
				lunch: 'Carne a la plancha (pollo, ternera o pavo), tomates y café.',
				dinner:
					'Pescado hervido o a la plancha (también marisco). Ensalada mixta, pomelos u otra fruta del tiempo y café.'
			}
		],
		[
			{
				lunch: 'Hamburguesa de ternera a la plancha, verdura mixta, cocida o cruda y café o té.',
				dinner: 'Ensalada mixta, cualquier tipo de fruta y café o té.'
			}
		],
		[
			{
				lunch: 'Chuletas de cordero a la plancha sin grasa, ensalada mixta y café o té.',
				dinner:
					'Un verde con tomate y atún sin aceite, melón o fruta del tiempo a voluntad y café o té.'
			}
		]
	];

	const breakfast =
		'El mismo para todos los dias de la semana: Fruta del tiempo en cantidad libre (no mezclar) una tostada y un té o café sin azúcar (con sacarina, si desea).';

	let hours = new Date().getHours();
	let today = new Date().getDay();

	const nextLunch = () => {
		if (hours < 11) {
			return breakfast;
		}
		if (hours < 15) {
			return diet[today][0].lunch;
		}
		if (hours < 23) {
			return diet[today][0].dinner;
		}
	};

    const nextDiet = nextLunch();
	
</script>

<section class="m-6 mt-3 sm:m-auto md:min-w-[700px] lg:min-w-[976px]">
	<h1 class="mb-3">Dieta</h1>
	<h2 class="font-bold">Te toca comer:</h2>
	<p>{nextDiet}</p>

    <h2 class="mt-5 mb-3 font-bold">Dieta de toda la semana</h2>
    <ul >
        {#each diet as day, i}
            <li class="mb-2">
                <h3 class="font-bold">Día {i + 1}</h3>
                <ul>
                    {#each day as meal}
                        <li>
                            <p>Comida: {meal.lunch}</p>
                            <p>Cena: {meal.dinner}</p>
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
</section>


