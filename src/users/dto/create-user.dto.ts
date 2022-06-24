import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
// import { BadRequestException } from "@nestjs/common";
import { NotIn } from "../../utils/validators/NotIn";

export class CreateUserDto {
    // 사용자 이름은 2자 이상 30자 이하인 문자열이어야 한다.
    @Transform(({ value }) => value.trim()) // 공백 입력 제거
    @NotIn('password', { message: '비밀번호에 이름을 사용할 수 없습니다.' })
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    readonly name: string;

    // 사용자 이메일은 60자 이하의 문자열로써 이메일 주소 형식에 적합해야 한다.
    @IsString()
    @IsEmail()
    @MaxLength(60)
    readonly email: string;

    // 사용자 비밀번호는 영어 대소문자와 숫자 또는
    // 특수문자(!, @, #, $, %, ^, &, *, (, )) 로
    // 이루어진 8자 이상 30자 이하의 문자열이어야 한다.
    // @Transform(({ value, obj }) => {
    //     if (value.includes(obj.name.trim())) {
    //         throw new BadRequestException('비밀번호에 이름을 포함할 수 없습니다.');
    //     }
    //     return value;
    // })
    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    readonly password: string;
}