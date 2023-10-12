const containers = document.querySelectorAll('.fade');

        function checkContainers() {
            containers.forEach(container => {
                const containerTop = container.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (containerTop < windowHeight * 0.95) {
                    container.style.animation = 'fadeInRiseUp 1s ease-in-out forwards';
                } else {
                    container.style.animation = 'none';
                }
            });
        }
        window.addEventListener('scroll', checkContainers);
        window.addEventListener('load', checkContainers);

		const containers2 = document.querySelectorAll('.right');

        function checkContainers2() {
            containers2.forEach(container => {
                const containerTop = container.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (containerTop < windowHeight * 0.95) {
                    container.style.animation = 'fadeInRight 1s ease-in-out forwards';
                } else {
                    container.style.animation = 'none';
                }
            });
        }
        window.addEventListener('scroll', checkContainers2);
        window.addEventListener('load', checkContainers2);

		const containers3 = document.querySelectorAll('.left');

		function checkContainers3() {
			containers3.forEach(container => {
				const containerTop = container.getBoundingClientRect().top;
				const windowHeight = window.innerHeight;
				if (containerTop < windowHeight * 0.95) {
					container.style.animation = 'fadeInLeft 1s ease-in-out forwards';
				} else {
					container.style.animation = 'none';
				}
			});
		}
		window.addEventListener('scroll', checkContainers3);
		window.addEventListener('load', checkContainers3);