# Como usar?

A especificação da máquina é dada em uma arquivo .txt, a construção do .txt deve seguir da seguinte forma:

-------------------------------------------------------------

estados: q0 q1 ....

alfabeto: a b ....

fitaAlfabeto: a b ⊔ ⊳  ....

estadoInicial: q0

estadosAceita: qa

estadosRejeita: qr

q0 a -> q1 * R

...

-----------------------------------------------------------

Após "estadosRejeita", até o final do arquivo, ficam as transições, sempre separadas por ->, o lado esquerdo, um tupla, contém o estado e o simbolo lido pelo cabeçote, o lado direito, uma tripla, corresponde a uma derivação a partir da configuração anterior, primeiro vem o próximo estado, depois o simbolo para escrever e por fim a direção do movimento do cabeçote, R direita, L esquerda, ao usar asterisco (*), você ignora o simbolo lido, o simbolo a ser escrito ou ignora a movimentação do cabeçote naquela transição

Na pasta "machines" contem 4 arquivos .txt prontos com as linguagens ww, a(2^n), strings com dois a's ou 2 b's seguidos e a linguagem a(3n), você pode usá-las para testes, você também pode definir o número de passos máximos nas derivações e decidir durante o teste se continua ou não, as linguagens ww, e dois a's ou b's seguidos, elas possuem loop's garantidos (utilizam não determinismo) então sempre terá um ramo que existirá infinitamente, os outros dois arquivos descrevem uma máquina que decidem a linguagem, então não terá loops, o campo de testes só aceita strings que possuem simbolos válidos no alfabeto da linguagem ou vazio (⊔)
