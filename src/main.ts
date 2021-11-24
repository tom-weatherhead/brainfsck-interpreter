// brainfsck-interpreter/src/main.ts
// ThAW: Started on 2021-11-20

import { readFile } from 'fs/promises';

const characterEncoding = 'utf8';

function calculateSquareBracketPairIndices(programTape: string): [number, number][] {
	const result: [number, number][] = [];
	const leftSquareBracketIndices: number[] = [];

	programTape.split('').forEach((char: string, i: number) => {
		if (char === '[') {
			leftSquareBracketIndices.push(i);
		} else if (char === ']') {
			const j = leftSquareBracketIndices.pop();

			if (typeof j === 'undefined') {
				throw new Error('] with no matching [');
			}

			result.push([j, i]);
		}
	});

	if (leftSquareBracketIndices.length > 0) {
		throw new Error('[ with no matching ]');
	}

	return result;
}

function getMatchingBracketIndex(
	squareBracketPairIndices: [number, number][],
	i: number,
	bracketIndex: number
): number {
	const foo = squareBracketPairIndices.find(
		(obj: [number, number]) => obj[bracketIndex] === i - 1
	);

	if (typeof foo === 'undefined') {
		throw new Error('getMatchingBracketIndex() : find() failed.');
	}

	return foo[1 - bracketIndex] + 1;
}

// From https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin :

async function getKeypress(): Promise<string> {
	return new Promise((resolve) => {
		process.stdin.setRawMode(true); // So we will get each keypress
		process.stdin.resume(); // Resume stdin in the parent process
		process.stdin.once('data', (buffer) => {
			// once() is like on(), but once() removes the listener also.
			process.stdin.setRawMode(false);

			const key = buffer.toString(characterEncoding);

			if (key === '\u0003') {
				console.log('\nExecution stopped via Ctrl-C.');
				process.exit(0);
			}

			resolve(key);
		});
	});
}

async function main(): Promise<void> {
	if (process.argv.length !== 3) {
		throw new Error('process.argv.length !== 3');
	}

	const filepath = process.argv[2];

	let programTape = '';

	try {
		programTape = await readFile(filepath, characterEncoding);
	} catch (error) {
		console.error('readFile() error:', error);
		throw error;
	}

	let programTapeIndex = 0;

	// From https://esolangs.org/wiki/Brainfuck : It prints 'Hello World!\n'
	// const programTape =
	// 	'++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.';

	// A brainfuck interpreter implemented in brainfuck:
	//
	// >>>+[[-]>>[-]++>+>+++++++[<++++>>++<-]++>>+>+>+++++[>++>++++++<<-]+>>>,<++[[>[
	// ->>]<[>>]<<-]<[<]<+>>[>]>[<+>-[[<+>-]>]<[[[-]<]++<-[<+++++++++>[<->-]>>]>>]]<<
	// ]<]<[[<]>[[>]>>[>>]+[<<]<[<]<+>>-]>[>]+[->>]<<<<[[<<]<[<]+<<[+>+<<-[>-->+<<-[>
	// +<[>>+<<-]]]>[<+>-]<]++>>-->[>]>>[>>]]<<[>>+<[[<]<]>[[<<]<[<]+[-<+>>-[<<+>++>-
	// [<->[<<+>>-]]]<[>+<-]>]>[>]>]>[>>]>>]<<[>>+>>+>>]<<[->>>>>>>>]<<[>.>>>>>>>]<<[
	// >->>>>>]<<[>,>>>]<<[>+>]<<[+<<]<]
	//
	// [input a brainfuck program and its input, separated by an exclamation point.
	// Daniel B Cristofani (cristofdathevanetdotcom)
	// http://www.hevanet.com/cristofd/brainfuck/]

	const squareBracketPairIndices = calculateSquareBracketPairIndices(programTape);

	const dataTape = [0];
	let dataTapeIndex = 0;

	// let printedText = '';
	let maxCharsToPrint = -1; // Set to a negative number to avoid limiting printed chars
	let c: string;

	while (programTapeIndex < programTape.length) {
		const char = programTape[programTapeIndex++];

		switch (char) {
			case '<': // Move the pointer to the left
				if (--dataTapeIndex < 0) {
					dataTape.unshift(0);
					dataTapeIndex = 0;
				}

				break;

			case '>': // Move the pointer to the right
				if (++dataTapeIndex >= dataTape.length) {
					dataTape.push(0);
				}

				break;

			case '+': // Increment the memory cell at the pointer
				dataTape[dataTapeIndex]++;
				break;

			case '-': // Decrement the memory cell at the pointer
				dataTape[dataTapeIndex]--;
				break;

			case ',': // Input a character and store it in the cell at the pointer
				// ? See https://stackoverflow.com/questions/3430939/node-js-readsync-from-stdin
				// dataTape[dataTapeIndex] = (await getChar()).charCodeAt(0);
				dataTape[dataTapeIndex] = (await getKeypress()).charCodeAt(0);
				break;

			case '.': // Output the character signified by the cell at the pointer
				c = String.fromCharCode(dataTape[dataTapeIndex]);
				// console.log('Printing:', );
				process.stdout.write(c);
				// printedText = printedText + c;

				if (maxCharsToPrint > 0) {
					maxCharsToPrint--;
				}

				break;

			case '[': // Jump past the matching ] if the cell at the pointer is 0
				if (dataTape[dataTapeIndex] === 0) {
					// Find the index of the right bracket that matches this left bracket:
					programTapeIndex = getMatchingBracketIndex(
						squareBracketPairIndices,
						programTapeIndex,
						0
					);
				}

				break;

			case ']': // Jump back to the matching [ if the cell at the pointer is nonzero
				if (dataTape[dataTapeIndex] !== 0) {
					// Find the index of the left bracket that matches this right bracket:
					programTapeIndex = getMatchingBracketIndex(
						squareBracketPairIndices,
						programTapeIndex,
						1
					);
				}

				break;

			default:
				break;
		}

		if (maxCharsToPrint === 0) {
			break;
		}
	}

	// return printedText;
}

main()
	.then()
	// .then((printedText: string) => {
	// 	console.log(`Final printedText: '${printedText}'`);
	// })
	.catch((error: unknown) => {
		console.error('Outermost catch: error:', typeof error, error);
	})
	.finally(() => {
		// process.stdin.close() ? or .pause() ? etc.
		process.exit(0);
	});
