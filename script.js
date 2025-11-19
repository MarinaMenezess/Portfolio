document.addEventListener('DOMContentLoaded', () => {
    
    // ====================================
    // 1. NAVEGAÇÃO SUAVE (SMOOTH SCROLL)
    // Garante que, ao clicar nos links do menu, a rolagem seja suave.
    // ====================================
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Previne o comportamento padrão de salto instantâneo
            e.preventDefault();

            // Pega o ID da seção alvo (ex: '#about', '#projects')
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Rola suavemente até a seção
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // 2. FILTRO E BUSCA DE HABILIDADES (KNOWLEDGE)
    // Permite buscar e filtrar as habilidades na seção 'Knowledge'.
    // ====================================
    const searchInput = document.getElementById('skill-search');
    const skillItems = document.querySelectorAll('.skill-item');
    const filterDropdown = document.querySelector('.filter-dropdown');
    
    // Função principal de filtragem e busca
    const filterSkills = (searchTerm = '', filterCategory = 'all') => {
        const term = searchTerm.toLowerCase().trim();

        skillItems.forEach(item => {
            const skillText = item.textContent.toLowerCase();
            const itemCategory = item.getAttribute('data-category');

            // 1. Verifica se corresponde ao termo de busca
            const matchesSearch = skillText.includes(term);

            // 2. Verifica se corresponde à categoria selecionada
            const matchesCategory = filterCategory === 'all' || itemCategory === filterCategory;

            // Se corresponder à busca E ao filtro de categoria, exibe o item
            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };

    // Event Listener para a barra de busca
    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            filterSkills(searchInput.value);
        });
    }

    // Event Listener para o filtro All v (Simples: se clicar, reseta a busca)
    if (filterDropdown) {
         filterDropdown.addEventListener('click', () => {
            // Em uma implementação mais completa, isso abriria um menu dropdown
            // Para este exemplo, apenas limpamos a busca e mostramos todos
            if (searchInput) {
                searchInput.value = ''; // Limpa o campo de busca
            }
            filterSkills(''); // Filtra por termo vazio (mostra todos)
            alert('Filtro "All v" clicado! Funcionalidade de filtro avançada seria implementada aqui.');
        });
    }

    // Opcional: Efeito simples ao carregar a página
    console.log("Portfólio de Marina Menezes carregado com sucesso!");

});