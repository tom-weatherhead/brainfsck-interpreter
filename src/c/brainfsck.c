/* brainfsck-interpreter/src/c/brainfsck.c */
/* ThAW: Started on 2022-08-15 */

/* To compile and link: $ make */
/* To remove all build products: $ make clean */

/* A demonstration: $ make && ./brainfsck ../../examples/hello-world.bf */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
/* #include <ctype.h> */
/* #include <assert.h> */

/* #if WINDOWS */
/* #include <conio.h> / * For non-blocking getch() (without echo) and getche() (with echo) */
/* #endif */

/* #if MACOS or LINUX */
#include <termios.h>
#include <unistd.h>
/* #endif */

#if !defined(BOOL) && !defined(FALSE) && !defined(TRUE)
/* Our poor man's Boolean data type: */
#define BOOL int
#define FALSE 0
#define TRUE 1
#endif

const int maxProgramTapeLength = 4096;
char * programTape = NULL;
/* Assume that the program on the tape is terminated by a null character. */

const int maxDataTapeLength = 4096;
char * dataTape = NULL;

const int maxNumSquareBracketPairIndices = 20;
int numSquareBracketPairIndices = 0;
int squareBracketPairIndices[2 * maxNumSquareBracketPairIndices];

int leftSquareBracketIndices[maxNumSquareBracketPairIndices];

BOOL calculateSquareBracketPairIndices(void) {
	int i = 0;
	int sp = 0;	/* Stack pointer; for the leftSquareBracketIndices */

	numSquareBracketPairIndices = 0;

	while (i < maxProgramTapeLength && programTape[i] != '\0') {

		if (programTape[i] == '[') {

			if (sp >= maxNumSquareBracketPairIndices) {
				fprintf(stderr, "LeftSquareBracketIndices stack overflow.\n");
				return FALSE;
			}

			leftSquareBracketIndices[sp++] = i;
		} else if (programTape[i] == ']') {

			if (numSquareBracketPairIndices >= maxNumSquareBracketPairIndices) {
				fprintf(stderr, "SquareBracketPairIndices list overflow.\n");
				return FALSE;
			} else if (sp == 0) {
				fprintf(stderr, "LeftSquareBracketIndices stack underflow; unmatched ].\n");
				return FALSE;
			}

			squareBracketPairIndices[2 * numSquareBracketPairIndices] = leftSquareBracketIndices[--sp];
			squareBracketPairIndices[2 * numSquareBracketPairIndices + 1] = i;
			/* printf("SquareBracketPair %d: (%d, %d)\n", numSquareBracketPairIndices, squareBracketPairIndices[2 * numSquareBracketPairIndices], squareBracketPairIndices[2 * numSquareBracketPairIndices + 1]); */
			++numSquareBracketPairIndices;
		}

		++i;
	}

	if (sp != 0) {
		fprintf(stderr, "Unmatched [ remaining at end of program.\n");
		return FALSE;
	}

	return TRUE;
}

int getMatchingBracketIndex(int i, int bracketIndex) {
	int j;

	for (j = 0; j < numSquareBracketPairIndices; ++j) {

		if (squareBracketPairIndices[2 * j + bracketIndex] == i) {
			return squareBracketPairIndices[2 * j + 1 - bracketIndex];
		}
	}

	return -1; /* I.e. No match found */
}

/* #if MACOS or LINUX */
/* From https://www.reddit.com/r/C_Programming/comments/v5k3z1/reading_char_for_char_from_stdin_without_waiting/ : */

/* 2022-08-15 : This works on MacOS 12.5 with gcc: */

int getch()  {
	int ch;
	struct termios oldattr, newattr;

	tcgetattr(STDIN_FILENO, &oldattr);
	newattr = oldattr;
	newattr.c_lflag &= ~ICANON;
	/* If the ECHO fplag is enabled, then we have implemented getche() rather than getch() */
	newattr.c_lflag &= ~ECHO;
	newattr.c_cc[VMIN] = 1;
	newattr.c_cc[VTIME] = 0;
	tcsetattr(STDIN_FILENO, TCSANOW, &newattr);
	ch = getchar();
	tcsetattr(STDIN_FILENO, TCSANOW, &oldattr);

	return (ch == 4) ? EOF : ch;
}
/* #endif */

BOOL readProgramFromFile(int argc, char * argv[]) {

	if (argc < 2) {
		fprintf(stderr, "readProgramFromFile() : Too few command-line arguments.\n");
		return FALSE;
	}

	FILE * fp = fopen(argv[1], "r");
	/* Then read all text from fp and store it in programTape. */

	if (fp == NULL) {
		fprintf(stderr, "readProgramFromFile() : Failed to open the file '%s'.\n", argv[1]);
		return FALSE;
	}

	memset(programTape, 0, maxProgramTapeLength * sizeof(char));

	int i;

	for (i = 0; ; ++i) {
		const int ch = getc(fp);

		if (ch == EOF) {
			break;
		} else if (i >= maxProgramTapeLength) {
			fprintf(stderr, "readProgramFromFile() : Program tape overflow\n");
			fclose(fp);
			return FALSE;
		}

		programTape[i] = (char)ch;
	}

	fclose(fp);
	return TRUE;
}

int mainDelegate(int argc, char * argv[]) {
	/* The Hello, World program:
	strcpy(programTape, "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."); */

	/* The Echo program:
	strcpy(programTape, ",[.,]"); */

	/* The ... program:
	strcpy(programTape, ""); */

	if (!readProgramFromFile(argc, argv)) {
		fprintf(stderr, "readProgramFromFile() failed.\n");
		return 1; /* One (as a Unix exit code) indicates an error. */
	}

	if (!calculateSquareBracketPairIndices()) {
		fprintf(stderr, "calculateSquareBracketPairIndices() failed.\n");
		return 1;
	}

	printf("Starting the Brainfsck interpreter...\n\n");

	/* printf("14 -> %d\n", getMatchingBracketIndex(14, 0));
	printf("33 -> %d\n", getMatchingBracketIndex(33, 1));
	printf("43 -> %d\n", getMatchingBracketIndex(43, 0));
	printf("45 -> %d\n", getMatchingBracketIndex(45, 1));
	printf("8 -> %d\n", getMatchingBracketIndex(8, 0));
	printf("48 -> %d\n", getMatchingBracketIndex(48, 1));
	printf("17 -> %d\n", getMatchingBracketIndex(17, 0));
	printf("17 -> %d\n", getMatchingBracketIndex(17, 1)); */

	int programTapeIndex = 0;
	int dataTapeIndex = 0;

	memset(dataTape, 0, maxDataTapeLength * sizeof(char));

	/* let maxCharsToPrint = -1; // Set to a negative number to avoid limiting printed chars */

	int valueFromGetchar = 0;

	/* while (programTapeIndex < programTape.length && maxCharsToPrint !== 0) { */
	while (programTapeIndex < maxProgramTapeLength && programTape[programTapeIndex] != '\0') {
		const char ch = programTape[programTapeIndex++];

		switch (ch) {
			case '<': /* Move the pointer to the left */
				if (--dataTapeIndex < 0) {
					/* dataTape.unshift(0);
					dataTapeIndex = 0; */
					fprintf(stderr, "< : dataTapeIndex < 0\n");
					return 1;
					/* ? Or set dataTapeIndex = maxDataTapeLength - 1; ? */
				}

				break;

			case '>': /* Move the pointer to the right */
				if (++dataTapeIndex >= maxDataTapeLength) {
					fprintf(stderr, "> : dataTapeIndex >= maxDataTapeLength\n");
					return 1;
					/* ? Or set dataTapeIndex = 0; ? (If we are not running in "strict mode") */
				}

				break;

			case '+': /* Increment the memory cell at the pointer */
				dataTape[dataTapeIndex]++;
				break;

			case '-': /* Decrement the memory cell at the pointer */
				dataTape[dataTapeIndex]--;
				break;

			case ',': /* Input a character and store it in the cell at the pointer */
				/* dataTape[dataTapeIndex] = (await getKeypress()).charCodeAt(0); */
				/* getchar(); ? getch(); ? getc(); ? */

				/* getchar() blocks execution until newline or EOF.
				valueFromGetchar = getchar(); */

				/* #if MACOS or LINUX */
				valueFromGetchar = getch();
				/* #endif */

				/* getc(stdin) also blocks execution until newline or EOF.
				valueFromGetchar = getc(stdin); */

				if (valueFromGetchar == EOF) {
					/* fprintf(stderr, "getchar() returned EOF\n");
					return 1; */

					/* Or just: */
					valueFromGetchar = 0; /* Handle the EOF like a null char */
					printf("getchar() returned EOF\n");
				} else {
					printf("getchar() returned char '%c', int %d\n", (char)valueFromGetchar, valueFromGetchar);
				}

				dataTape[dataTapeIndex] = (char)valueFromGetchar;
				break;

			case '.': /* Output the character signified by the cell at the pointer */
				/* if (maxCharsToPrint > 0) {
					maxCharsToPrint--;
				} */

				printf("%c", (char)dataTape[dataTapeIndex]);

				break;

			case '[': /* Jump past the matching ] if the cell at the pointer is 0 */
				if (dataTape[dataTapeIndex] == 0) {
					/* Find the index of the right bracket that matches this left bracket: */
					programTapeIndex = getMatchingBracketIndex(
						programTapeIndex,
						0
					);

					if (programTapeIndex < 0) {
						fprintf(stderr, "[ : Bad MatchingBracketIndex\n");
						return 1;
					}
				}

				break;

			case ']': /* Jump back to the matching [ if the cell at the pointer is nonzero */
				/* printf("] : programTapeIndex is %d; data at %d is %d\n", programTapeIndex, dataTapeIndex, (int)dataTape[dataTapeIndex]); */

				if (dataTape[dataTapeIndex] != 0) {
					/* Find the index of the left bracket that matches this right bracket: */
					programTapeIndex = getMatchingBracketIndex(
						programTapeIndex - 1,
						1
					);

					if (programTapeIndex < 0) {
						fprintf(stderr, "] : Bad MatchingBracketIndex\n");
						return 1;
					}
				}

				break;

			default:
				break;
		}
	}

	return 0; /* Zero (as a Unix exit code) means success. */
}

int main(int argc, char * argv[]) {
	programTape = (char *)malloc(maxProgramTapeLength * sizeof(char));
	dataTape = (char *)malloc(maxDataTapeLength * sizeof(char));

	const int status = mainDelegate(argc, argv);

	free(dataTape);
	free(programTape);

	printf("\nThe program has terminated.\n\n");

	return status;
} /* main() */

/* ******** End of brainfsck.c ******** */
