# ci-delta-test

Um repositório temporário destinado a testar as integrações de CI do GitHub
de ponta a ponta.

## Como funciona a CI

O workflow em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) é
executado a cada push de uma branch. Cinco jobs independentes criam cinco
verificações distintas no GitHub:

| Verificação | Trabalho simulado |
| --- | --- |
| Lint | 10 segundos |
| Verificação de tipos | 20 segundos |
| Testes unitários | 30 segundos |
| Testes de integração | 40 segundos |
| Compilação | 50 segundos |

Os jobs podem ser executados em paralelo e terminar em momentos diferentes, o
que facilita observar as mudanças de estado. A inicialização do runner e a
espera na fila podem levar algum tempo. Cada job tem um timeout de dois
minutos.

Estas são verificações fictícias: elas simplesmente exibem mensagens e esperam
antes de serem concluídas com sucesso. Elas não analisam o código. Não são
necessários aplicativos, dependências ou informações confidenciais.

Observe as execuções na aba **Actions** do repositório. O GitHub Actions relata
as execuções das verificações, não os estados antigos dos commits. O workflow
usa apenas o evento de push; portanto, abrir uma pull request não inicia uma
segunda execução.

## Criar uma branch, fazer push, aguardar a CI e fazer o merge

Comece pelo estado mais recente de `main`, para que sua branch contenha o
workflow:

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/ci-example
git commit --allow-empty -m "Exercise the CI flow"
git push -u origin feature/ci-example
```

Um commit vazio é suficiente para executar um teste; você também pode fazer
commit de alterações reais nos arquivos. Abra uma pull request da sua branch
para `main`, verifique as cinco verificações e faça o merge da pull request
quando todas forem concluídas com sucesso. O push do merge para `main` também
inicia a CI.

O merge continua sendo manual. Para impedir um merge antes que a CI seja
concluída com sucesso, configure uma regra de proteção de branch ou um ruleset
do GitHub para `main` que exija essas cinco verificações. O workflow, por si
só, não impõe essa restrição.

### Branches existentes sem o workflow

Na sua branch de funcionalidade, recupere a configuração de `main`:

```sh
git fetch origin
git merge origin/main
git push
```

As verificações pertencem a um commit específico. Adicionar o workflow inicia
verificações no novo commit enviado; isso não adiciona verificações aos commits
anteriores.

## Iniciar outra execução

Em uma branch já enviada que contenha o workflow:

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

## Testar uma falha

Em um job, substitua a etapa de simulação por:

```yaml
      - name: Fail intentionally
        run: exit 1
```

Faça commit e push da alteração para obter uma verificação malsucedida. Em
seguida, restaure a etapa bem-sucedida e faça push novamente para obter uma
verificação aprovada. Os outros jobs continuam independentes e podem continuar
sendo concluídos com sucesso.

## Um pequeno experimento

Este repositório é propositalmente simples: faça uma pequena alteração, crie o
commit e faça push para observar o ciclo completo de feedback:

1. Sua branch recebe um commit.
2. O GitHub Actions inicia cinco verificações independentes.
3. As verificações terminam de acordo com seus próprios tempos.
4. A pull request mostra o resultado combinado.

Assim, este é um lugar prático para experimentar branches, commits, pull
requests e CI sem precisar configurar um aplicativo primeiro.

### Verificação rápida

Se você estiver testando apenas a conexão com o repositório, adicionar uma
breve nota como esta é suficiente para produzir um diff real sem alterar o
comportamento da CI.

> Nota de teste: esta linha foi adicionada como uma alteração inofensiva ao README.
