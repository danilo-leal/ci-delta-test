# ci-delta-test

Um repositório temporário para testar integrações de CI do GitHub de ponta a ponta.

## Como a CI funciona

O workflow em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) é executado
sempre que uma branch é enviada. Cinco tarefas independentes criam cinco
verificações separadas no GitHub:

| Verificação | Tarefa simulada |
| --- | --- |
| Lint | 10 segundos |
| Verificação de tipos | 20 segundos |
| Testes unitários | 30 segundos |
| Testes de integração | 40 segundos |
| Build | 50 segundos |

As tarefas podem ser executadas em paralelo e terminar em momentos diferentes,
facilitando a observação das mudanças de status. Iniciar os executores e
aguardar na fila pode levar algum tempo. Cada tarefa tem um limite de dois minutos.

Estas são verificações de teste: elas apenas exibem mensagens e aguardam antes
de serem concluídas com sucesso. Elas não analisam o código. Não são necessários
aplicativos, dependências ou segredos.

Acompanhe as execuções na aba **Actions** do repositório. O GitHub Actions
informa as execuções das verificações, não o status anterior dos commits. O
workflow usa somente o evento `push`, então abrir um pull request não inicia
outra execução.

## Crie uma branch, envie-a, aguarde a CI e faça o merge

Comece pela versão mais recente de `main` para que sua branch inclua o workflow:

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feature/ci-example
git commit --allow-empty -m "Exercise the CI flow"
git push -u origin feature/ci-example
```

Um commit sem alterações já é suficiente para executar um teste; você também
pode incluir mudanças reais nos arquivos. Abra um pull request da sua branch
para `main`, confira as cinco verificações e faça o merge quando todas forem
concluídas com sucesso. Enviar o merge para `main` também inicia a CI.

O merge continua sendo manual. Para impedir o merge antes de a CI ser concluída
com sucesso, configure uma regra de proteção de branch ou um conjunto de regras
do GitHub para `main` que exija estas cinco verificações. O workflow, por si só,
não impõe essa restrição.

### Branches existentes sem o workflow

Na sua branch de funcionalidade, incorpore a configuração de `main`:

```sh
git fetch origin
git merge origin/main
git push
```

As verificações pertencem a um commit específico. Ao adicionar o workflow, elas
são executadas no commit que você acabou de enviar; verificações não são
adicionadas retroativamente a commits anteriores.

## Inicie outra execução

Em uma branch que você já enviou e que contém o workflow:

```sh
git commit --allow-empty -m "Trigger CI"
git push
```

## Teste uma falha

Em uma das tarefas, substitua a etapa simulada por:

```yaml
      - name: Fail intentionally
        run: exit 1
```

Faça o commit e envie a mudança para obter uma verificação com falha. Em
seguida, restaure a etapa bem-sucedida e envie novamente para obter uma
verificação aprovada. As outras tarefas continuam independentes e ainda podem
ser concluídas com sucesso.

## Um experimento simples

Este repositório é intencionalmente simples: faça uma pequena alteração, crie
um commit e envie-o para ver o ciclo completo de feedback:

1. Sua branch recebe um commit.
2. O GitHub Actions inicia cinco verificações independentes.
3. As verificações terminam em seus próprios horários.
4. O pull request mostra o resultado combinado.

Assim, você tem um lugar prático para experimentar com branches, commits, pull
requests e CI sem precisar configurar um aplicativo antes.

### Teste rápido

Se você estiver apenas testando a conexão com o repositório, adicionar uma
breve observação como esta é suficiente para criar um diff real sem alterar o
comportamento da CI.

> Observação de teste: esta linha foi adicionada ao README como uma mudança inofensiva.

> Mais uma observação rápida de teste.

> Mais uma pequena alteração para testar o fluxo de edição.

> Outro teste: o README continua fácil de editar.
