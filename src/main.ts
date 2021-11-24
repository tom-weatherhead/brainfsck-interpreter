// brainfsck-interpreter/src/main.ts
// ThAW: Started on 2021-11-20

import { readFile } from 'fs/promises';

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

// const bufferForGetChar = Buffer.alloc(1);

async function getChar(): Promise<string> {
	// Attempt 1:
	// From https://nodejs.org/api/fs.html#fsreadsyncfd-buffer-offset-length-position :
	// fs.readSync(fd, buffer, offset, length, position);
	// fd === 0 means stdin. (1 === stdout; 2 === stderr.)

	// fs.readSync(0, bufferForGetChar, 0, 1, 0);
	// fs.readSync(process.stdin.fd, bufferForGetChar, 0, 1, 0);

	// Attempt 2:
	// process.stdin.resume();
	// // var fs = require('fs');
	// const response = fs.readSync(process.stdin.fd, bufferForGetChar); // 100, 0, 'utf8');
	// process.stdin.pause();
	//
	// console.log('getChar() : readSync response:', typeof response, response);
	// console.log('getChar() : bufferForGetChar:', bufferForGetChar.toString('utf8'));

	// return bufferForGetChar.toString('utf8');

	// Attempt 3 (placeholder) :
	// return '\0';

	// Attempt 4:
	// macOS: Type a character, and then press ctrl-D twice.
	// console.log('\nType a character, and then press ctrl-D twice:');
	//
	// return /* fs. */ readFileSync('/dev/stdin').toString('utf8'); // *nix only, not Windows

	// Attempt 5:
	// let result: string;
	//
	// for (;;) {
	// 	const resultXXX = process.stdin.read(1); // .toString('utf8');
	// 	console.log('getChar() : process.stdin.read(1) result:', typeof resultXXX, resultXXX);
	//
	// 	if (resultXXX !== null) {
	// 		result = resultXXX.toString('utf8');
	// 		break;
	// 	}
	//
	// 	// process.sleep(1);
	// }
	//
	// console.log('getChar() : result:', typeof result, result);
	//
	// return result;

	// Attempt 6: async"
	// fs.readSync(process.stdin.fd, bufferForGetChar, 0, 1, 0);

	console.log('\nType a character, and then press return:');

	let result;

	for (;;) {
		result = await process.stdin.read(1);
		console.log('getChar() : result:', typeof result, result);

		if (`${result}` !== 'null') {
			break;
		}

		await new Promise((r) => setTimeout(r, 1000)); // Sleep for one second.
	}

	return result.toString('utf8');
}

async function main(): Promise<string> {
	if (process.argv.length !== 3) {
		throw new Error('process.argv.length !== 3');
	}

	const filepath = process.argv[2];

	let programTape = '';

	try {
		programTape = await readFile(filepath, 'utf8');
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

	let printedText = '';
	let maxCharsToPrint = -1; // Set to a negative number to avoid limiting printed chars

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
				dataTape[dataTapeIndex] = (await getChar()).charCodeAt(0);
				break;

			case '.': // Output the character signified by the cell at the pointer
				console.log('Printing:', String.fromCharCode(dataTape[dataTapeIndex]));
				printedText = printedText + String.fromCharCode(dataTape[dataTapeIndex]);

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

	return printedText;
}

main()
	.then((printedText: string) => {
		console.log(`Final printedText: '${printedText}'`);
	})
	.catch((error: unknown) => {
		console.error('Outermost catch: error:', typeof error, error);
	});
