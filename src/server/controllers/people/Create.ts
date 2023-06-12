import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup'; // Yup é uma biblioteca de validação de formulários
import { validation } from '../../shared/middleware';
import { IPerson } from '../../database/models';
import { PeopleProvider } from '../../database/providers/people';

interface IBodyProps extends Omit<IPerson, 'id'>{} // Tipo do body da request. O Omit omite uma propriedade, recebe um 'objeto' e o que irá omitir dentro dele.

export const createValidation = validation((getSchema) => ({ // Middleware que irá validar body, params e query.
  body: getSchema<IBodyProps>(yup.object().shape({ //Shape dos campos desejados
    email: yup.string().required().email(),
    cityId: yup.number().required().integer().moreThan(0),
    fullName: yup.string().required().min(3),
  }))
}));


// 2 objetos vazios pq o ReqBody tem que ficar na 3° posição, só passar o mouse em cima de Request para ver
export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  const result = await PeopleProvider.create(req.body); // Utiliza o provider para criar cidade no banco de dados
  
  if(result instanceof Error){
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  }
  
  return res.status(201).json(result);
};