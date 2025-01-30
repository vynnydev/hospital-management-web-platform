/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class', // Alterado aqui, apenas 'class' é necessário
	content: [
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
   
	  // Or if using `src` directory:
	  "./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		backgroundColor: {
		  'opacity-20': 'rgba(var(--tw-bg-opacity), 0.2)',
		  'opacity-40': 'rgba(var(--tw-bg-opacity), 0.4)',
		  'opacity-60': 'rgba(var(--tw-bg-opacity), 0.6)',
		  'opacity-80': 'rgba(var(--tw-bg-opacity), 0.8)'
		},
		backgroundImage: {
			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
		},
		keyframes: {
		  'accordion-down': {
			from: { height: '0' },
			to: { height: 'var(--radix-accordion-content-height)' }
		  },
		  'accordion-up': {
			from: { height: 'var(--radix-accordion-content-height)' },
			to: { height: '0' }
		  }
		},
		animation: {
		  'accordion-down': 'accordion-down 0.2s ease-out',
		  'accordion-up': 'accordion-up 0.2s ease-out'
		}
	  }
	},
	plugins: [],
  }