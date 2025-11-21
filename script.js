document.addEventListener('DOMContentLoaded', () => {
    
    // ====================================
    // 1. NAVEGAÇÃO SUAVE (SMOOTH SCROLL)
    // ====================================
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================================
    // 2. FILTRO E BUSCA DE HABILIDADES (KNOWLEDGE)
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

            const matchesSearch = skillText.includes(term);
            const matchesCategory = filterCategory === 'all' || itemCategory === filterCategory;

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

    // Event Listener para o filtro All v
    if (filterDropdown) {
         filterDropdown.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = ''; 
            }
            filterSkills('');
            alert('Filtro "All v" clicado! Funcionalidade de filtro avançada seria implementada aqui.');
        });
    }

    // ====================================
    // 3. FUNCIONALIDADE DO CARROSSEL (PROJECTS)
    // ====================================
    const carousel = document.querySelector('.projects-carousel');
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    const scrollStep = 320; 

    if (carousel && leftArrow && rightArrow) {
        leftArrow.addEventListener('click', () => {
            carousel.scrollBy({
                left: -scrollStep,
                behavior: 'smooth'
            });
        });

        rightArrow.addEventListener('click', () => {
            carousel.scrollBy({
                left: scrollStep,
                behavior: 'smooth'
            });
        });
    }

    // ====================================
    // 4. CARREGAMENTO DE PROJETOS DO GITHUB
    // ====================================

    // Seu nome de usuário:
    const githubUsername = 'MarinaMenezess'; 

    // Função para criar o HTML de um cartão de projeto (COM data-tech-language)
    const createProjectCard = (repo) => {
        // Mapeia o array de linguagens para tags HTML, adicionando o data-tech-language
        const allLanguages = repo.all_languages || [];
        const techTagsHtml = allLanguages.map(lang => 
            `<span class="tech-tag" data-tech-language="${lang}">${lang}</span>`
        ).join('');
        
        const liveLink = repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="repo-link">Ver Demo</a>` : '';

        return `
            <div class="project-card">
                <div class="project-image-placeholder">${repo.name}</div>
                <h3>${repo.name}</h3> 
                <p>${repo.description || 'Nenhuma descrição disponível.'}</p> 
                <div class="tech-stack">
                    ${techTagsHtml} 
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="repo-link">Repositório</a>
                    ${liveLink}
                </div>
            </div>
        `;
    };

    // Função para buscar os repositórios do GitHub
    const fetchGitHubRepos = async () => {
        if (!carousel || githubUsername === '') {
            console.error("Erro: Elemento do carrossel não encontrado ou nome de usuário vazio.");
            if (carousel) {
                carousel.innerHTML = '<p style="color: var(--primary-red); text-align: center; width: 100%;">⚠️ Elemento não encontrado ou nome de usuário vazio.</p>';
            }
            return; 
        }
        
        const initialApiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`;

        try {
            carousel.innerHTML = '<p style="text-align: center; width: 100%; color: var(--text-muted);">Carregando projetos...</p>';
            
            // 1. Busca inicial dos repositórios
            const initialResponse = await fetch(initialApiUrl);
            
            if (!initialResponse.ok) {
                throw new Error(`Erro ao buscar repositórios: ${initialResponse.status} ${initialResponse.statusText}`);
            }
            
            let repos = await initialResponse.json(); 
            
            // 2. Cria promises para buscar as linguagens de CADA repositório
            const languagePromises = repos.map(async (repo) => {
                const languagesUrl = repo.languages_url; 
                const langResponse = await fetch(languagesUrl);
                
                if (!langResponse.ok) {
                    console.warn(`Aviso: Falha ao buscar linguagens para ${repo.name}. Usando a linguagem principal.`);
                    repo.all_languages = repo.language ? [repo.language] : []; 
                    return repo;
                }
                
                const langData = await langResponse.json();
                // Pega apenas as chaves (nomes das linguagens)
                repo.all_languages = Object.keys(langData); 
                return repo;
            });
            
            // 3. Espera que todas as chamadas de API de linguagens sejam concluídas
            repos = await Promise.all(languagePromises);
            
            // 4. Filtra (MANTÉM O FILTRO: não fork E tem descrição)
            const filteredRepos = repos.filter(repo => !repo.fork && repo.description); 
            console.log("Total de repositórios filtrados para exibição:", filteredRepos.length); 

            if (filteredRepos.length > 0) {
                // 5. Gera o HTML usando as múltiplas linguagens
                carousel.innerHTML = filteredRepos.map(createProjectCard).join('');
            } else {
                carousel.innerHTML = '<p style="text-align: center; width: 100%; color: var(--text-muted);">Nenhum projeto relevante encontrado no GitHub.</p>';
            }

        } catch (error) {
            console.error('Falha ao carregar repositórios do GitHub:', error);
            carousel.innerHTML = `<p style="color: var(--primary-red); text-align: center; width: 100%;">Erro: ${error.message}. Verifique o nome de usuário (MarinaMenezess) no GitHub.</p>`;
        }
    };

    // Chama a função para carregar os projetos
    fetchGitHubRepos();

    console.log("Portfólio de Marina Menezes carregado com sucesso!");

});