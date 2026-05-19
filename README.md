# ⏱️ Timer Exercise

Temporizador para exercícios físicos com uma interface moderna e responsiva, construído com React e Vite.

## 🌐 Acesse o App

**[https://guiribeirodev.github.io/timer-exercise/](https://guiribeirodev.github.io/timer-exercise/)**

## ✨ Funcionalidades

### Timer Simples
- Selecione um tempo predefinido ou defina minutos e segundos manualmente
- Visualize o tempo restante com um anel animado
- Controles de pausar, retomar e resetar
- Alerta sonoro ao finalizar o tempo

### Treino em Ciclos
- Monte um treino personalizado adicionando exercícios com nome e duração
- Configure o número de ciclos (repetições do treino completo)
- Acompanhe o progresso de cada exercício e ciclo durante a execução
- Controles de pausar, retomar e parar o treino

### Treinos Salvos
- Salve seus treinos favoritos com um nome para reutilizar depois
- Carregue treinos salvos diretamente no construtor
- Exclua treinos com confirmação via modal (para evitar exclusões acidentais)
- Os treinos ficam salvos no armazenamento local do navegador (localStorage)

## 🛠️ Tecnologias

- **React 19** — Biblioteca para construção da interface
- **Vite** — Ferramenta de build ultrarrápida
- **Tailwind CSS 4** — Estilização com classes utilitárias
- **Electron** — Plataforma para desenvolvimento de aplicativos desktop nativos usando tecnologias web
- **Electron Builder** — Empacotador e compilador de instaladores para macOS, Windows e Linux
- **Vitest** — Framework de testes unitários
- **Testing Library** — Testes com foco na experiência do usuário
- **GitHub Actions** — Deploy automático no GitHub Pages

## 🚀 Rodando Localmente

### Versão Web

```bash
# Clone o repositório
git clone https://github.com/guiribeirodev/timer-exercise.git
cd timer-exercise

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173/`.

### Versão Desktop (Electron)

Para rodar a aplicação como um aplicativo desktop em modo de desenvolvimento com Hot Reload:

```bash
npm run electron:dev
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm run test

# Rodar testes em modo watch (re-executa ao salvar arquivos)
npm run test:watch
```

## 📦 Build e Empacotamento

### Compilar para a Web

```bash
npm run build
```

Os arquivos estáticos otimizados serão gerados na pasta `dist/`.

### Compilar para Desktop (Electron)

Para empacotar a aplicação e gerar instaladores nativos completos (`.AppImage` e `.deb` para Linux, além de suporte para Windows e macOS):

```bash
npm run electron:build
```

Os instaladores compilados e executáveis finais serão gerados na pasta `dist-electron/`.

## 📁 Estrutura do Projeto

```
├── electron/
│   ├── main.js             # Processo principal do Electron (janela desktop)
│   └── preload.js          # Script de preload seguro (Context Bridge)
├── src/
│   ├── components/
│   │   ├── ConfirmModal.jsx    # Modal de confirmação reutilizável
│   │   ├── ModeTabs.jsx        # Abas Timer / Ciclo de Exercícios
│   │   ├── SavedWorkouts.jsx   # Lista de treinos salvos
│   │   ├── TimePicker.jsx      # Seletor de tempo (presets + manual)
│   │   ├── TimerControls.jsx   # Botões pausar / retomar / resetar
│   │   ├── TimerDisplay.jsx    # Exibição do tempo restante
│   │   ├── TimerRing.jsx       # Anel animado de progresso
│   │   ├── WorkoutBuilder.jsx  # Construtor de treino em ciclos
│   │   └── WorkoutRunner.jsx   # Execução do treino em ciclos
│   ├── hooks/
│   │   ├── useAlarmSound.js    # Som de alarme ao finalizar
│   │   ├── useCycleTimer.js    # Lógica do timer de ciclos
│   │   ├── useSavedWorkouts.js # CRUD de treinos no localStorage
│   │   └── useTimer.js         # Lógica do timer simples
│   ├── test/                   # Testes unitários
│   ├── App.jsx                 # Componente raiz
│   ├── index.css               # Estilos globais e tema
│   └── main.jsx                # Ponto de entrada
```
